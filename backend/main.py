from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os

from parser import parse_pdf
from database import SessionLocal, engine, Base
from models import User, Student, SemesterResult, Subject
from cgpa import (
    get_grade_point,
    get_credit,
    calculate_gpa,
    calculate_cgpa
)

app = FastAPI()

# ---------------------------------------
# CORS
# ---------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "CGPA Calculator Backend Running Successfully"
    }


# ---------------------------------------
# Request Model
# ---------------------------------------
class StudentUpdate(BaseModel):
    student_name: str
    department: str
    batch: str
    section: str

class SignupRequest(BaseModel):
    username: str
    email: str
    register_number: str
    department: str
    password: str
    role: str = "student"

class LoginRequest(BaseModel):
    username: str
    password: str

# ---------------------------------------
# Signup API
# ---------------------------------------
@app.post("/signup")
def signup(user: SignupRequest):

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.register_number == user.register_number
    ).first()

    if existing_user:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="User already exists."
        )

    new_user = User(
        username=user.username,
        email=user.email,
        register_number=user.register_number,
        department=user.department,
        password=user.password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {
        "message": "Signup Successful"
    }

# ---------------------------------------
# Login API
# ---------------------------------------
@app.post("/login")
def login(user: LoginRequest):

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.username == user.username,
        User.password == user.password
    ).first()

    if not existing_user:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid Username or Password"
        )

    db.close()

    return {
        "message": "Login Successful",
        "username": existing_user.username,
        "role": existing_user.role,
        "register_number": existing_user.register_number
    }

    
# ---------------------------------------
# Upload PDF
# ---------------------------------------
@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    batch: str = Form(...),
    semester: str = Form(...)
):

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    data = parse_pdf(file_path)

    if "error" in data:
        raise HTTPException(
            status_code=400,
            detail=data["message"]
        )

    if not data["semester"]:
        raise HTTPException(
            status_code=400,
            detail="Semester not found."
        )

    # ---------------------------------------
    # Credit & Grade Point
    # ---------------------------------------
    for subject in data["subjects"]:
        subject["credit"] = get_credit(subject["code"])
        subject["grade_point"] = get_grade_point(subject["grade"])

    sgpa = calculate_gpa(data["subjects"])

    db = SessionLocal()

    student = db.query(Student).filter(
        Student.register_number == data["register_number"]
    ).first()

    if not student:

        user = db.query(User).filter(
            User.register_number == data["register_number"]
        ).first()

        student = Student(
            register_number=data["register_number"],
            student_name=data["student_name"],
            department=user.department if user else data["department"],
            batch=batch,
            section=user.section if user else "A",
            current_semester=int(semester),
            current_cgpa=sgpa
        )

        db.add(student)
        db.commit()
        db.refresh(student)

    existing = db.query(SemesterResult).filter(
        SemesterResult.student_id == student.id,
        SemesterResult.semester == int(data["semester"])
    ).first()

    if existing:

        db.close()

        raise HTTPException(
            status_code=400,
            detail="Semester already uploaded."
        )

    semester_result = SemesterResult(
        student_id=student.id,
        semester=int(semester),
        sgpa=sgpa,
        result_pdf=file.filename
    )


    db.add(semester_result)
    db.commit()
    db.refresh(semester_result)

    for subject in data["subjects"]:

        db.add(
            Subject(
                semester_result_id=semester_result.id,
                subject_code=subject["code"],
                subject_name=subject["name"],
                grade=subject["grade"],
                credit=subject["credit"],
                grade_point=subject["grade_point"]
            )
        )

    db.commit()

    semester_results = db.query(SemesterResult).filter(
        SemesterResult.student_id == student.id
    ).all()

    cgpa = calculate_cgpa(semester_results)

    student.current_cgpa = cgpa
    student.current_semester = int(data["semester"])

    db.commit()
    db.close()

    return {
        "message": "PDF uploaded successfully",
        "semester_gpa": sgpa,
        "current_cgpa": cgpa
    }
# ---------------------------------------
# Get All Students
# ---------------------------------------
@app.get("/students")
def get_students():

    db = SessionLocal()

    students = db.query(Student).all()

    db.close()

    return students


# ---------------------------------------
# Get Single Student
# ---------------------------------------
@app.get("/student/{student_id}")
def get_student(student_id: int):

    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    result = {
        "id": student.id,
        "register_number": student.register_number,
        "student_name": student.student_name,
        "department": student.department,
        "batch": student.batch,
        "section": student.section,
        "current_semester": student.current_semester,
        "current_cgpa": float(student.current_cgpa),
        "semester_results": []
    }

    for semester in student.semester_results:

        sem = {
            "semester": semester.semester,
            "sgpa": float(semester.sgpa),
            "result_pdf": semester.result_pdf,
            "subjects": []
        }

        for subject in semester.subjects:

            sem["subjects"].append({
                "subject_code": subject.subject_code,
                "subject_name": subject.subject_name,
                "grade": subject.grade,
                "credit": subject.credit,
            })

        result["semester_results"].append(sem)

    db.close()

    return result


# ---------------------------------------
# Update Student
# ---------------------------------------
@app.put("/student/{student_id}")
def update_student(student_id: int, updated: StudentUpdate):

    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    student.student_name = updated.student_name
    student.department = updated.department
    student.batch = updated.batch
    student.section = updated.section

    db.commit()
    db.refresh(student)

    db.close()

    return {
        "message": "Student updated successfully"
    }


# ---------------------------------------
# Delete Student
# ---------------------------------------
@app.delete("/student/{student_id}")
def delete_student(student_id: int):

    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    db.delete(student)
    db.commit()

    db.close()

    return {
        "message": "Student deleted successfully"
    }