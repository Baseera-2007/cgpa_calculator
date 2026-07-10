from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os

from parser import parse_pdf
from database import SessionLocal, engine, Base
<<<<<<< HEAD
from models import Student, SemesterResult, Subject, Attendance
from schemas import AttendanceCreate
from datetime import date 
=======
from models import User, Student, SemesterResult, Subject
>>>>>>> 4c6ee56cea82c63d7a42f54ed23ff113b2f5a977
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
    gender: str
    student_name: str
    department: str
    batch: str
    section: str
    gender: str
    section: str

from typing import Optional

class SignupRequest(BaseModel):

    username: str

    department: str

    role: str

    password: str

    register_number: Optional[str] = None

    faculty_id: Optional[str] = None

    email: Optional[str] = None

    batch: Optional[str] = None

    section: Optional[str] = None

    gender: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# ---------------------------------------
# Signup API
# ---------------------------------------
@app.post("/signup")
def signup(user: SignupRequest):

    db = SessionLocal()

    # Check duplicate

    if user.role == "student":

        existing_user = db.query(User).filter(
            User.register_number == user.register_number
        ).first()

    else:

        existing_user = db.query(User).filter(
            User.faculty_id == user.faculty_id
        ).first()

    if existing_user:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="User already exists."
        )

    # Create User

    new_user = User(

        username=user.username,

        department=user.department,

        register_number=user.register_number,

        faculty_id=user.faculty_id,

        email=user.email,

        batch=user.batch,

        section=user.section,

        gender=user.gender,

        password=user.password,

        role=user.role,

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
<<<<<<< HEAD
        student = Student(
    register_number=data["register_number"],
    student_name=data["student_name"],
    department=data["department"],
    batch="2023-2027",
    section="A",
    gender="Female",
    current_semester=int(data["semester"]),
    current_cgpa=sgpa
)
=======

        user = db.query(User).filter(
            User.register_number == data["register_number"]
        ).first()

        student = Student(
            register_number=data["register_number"],
            student_name=data["student_name"],
            department=user.department if user else data["department"],
            batch=batch,
            section="A",
            current_semester=int(semester),
            current_cgpa=sgpa
        )
>>>>>>> 4c6ee56cea82c63d7a42f54ed23ff113b2f5a977

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
    student.gender = updated.gender

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
<<<<<<< HEAD
  
# ---------------------------------------
# Mark Attendance
# ---------------------------------------
@app.post("/attendance")
def mark_attendance(attendance: AttendanceCreate):

    db = SessionLocal()

    existing = db.query(Attendance).filter(
        Attendance.student_id == attendance.student_id,
        Attendance.attendance_date == attendance.attendance_date
    ).first()

    if existing:
        existing.status = attendance.status
        existing.marked_by = attendance.marked_by
        db.commit()
        db.refresh(existing)
        db.close()

        return {
            "message": "Attendance updated successfully"
        }

    new_attendance = Attendance(
        student_id=attendance.student_id,
        attendance_date=attendance.attendance_date,
        status=attendance.status,
        marked_by=attendance.marked_by
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
=======
from typing import Optional

@app.get("/dashboard")
def dashboard(batch: Optional[str] = None):

    db = SessionLocal()

    # Filter by batch if selected
    if batch:
        students = db.query(Student).filter(
            Student.batch == batch
        ).all()
    else:
        students = db.query(Student).all()

    total_students = len(students)

    if total_students == 0:
        db.close()
        return {
            "total_students": 0,
            "average_cgpa": 0,
            "highest_cgpa": 0,
            "above9": 0,
        }

    total = 0
    highest = 0
    above9 = 0

    for student in students:

        cgpa = float(student.current_cgpa or 0)

        total += cgpa

        if cgpa > highest:
            highest = cgpa

        if cgpa >= 9:
            above9 += 1
>>>>>>> 4c6ee56cea82c63d7a42f54ed23ff113b2f5a977

    db.close()

    return {
<<<<<<< HEAD
        "message": "Attendance marked successfully"
    }


# ---------------------------------------
# Get Attendance By Date
# ---------------------------------------
@app.get("/attendance")
def get_attendance(attendance_date: date):

    db = SessionLocal()

    attendance = db.query(Attendance).filter(
        Attendance.attendance_date == attendance_date
=======
        "total_students": total_students,
        "average_cgpa": round(total / total_students, 2),
        "highest_cgpa": highest,
        "above9": above9,
    }

    # -------------------------------------------------
# Get Students By Batch
# -------------------------------------------------
@app.get("/students/{batch}")
def get_students_by_batch(batch: str):

    db = SessionLocal()

    students = db.query(Student).filter(
        Student.batch == batch
>>>>>>> 4c6ee56cea82c63d7a42f54ed23ff113b2f5a977
    ).all()

    result = []

<<<<<<< HEAD
    for item in attendance:

        student = db.query(Student).filter(
            Student.id == item.student_id
        ).first()

        result.append({
            "student_id": student.id,
            "register_number": student.register_number,
            "student_name": student.student_name,
            "batch": student.batch,
            "section": student.section,
            "gender": student.gender,
            "status": item.status,
            "marked_by": item.marked_by
=======
    for s in students:
        result.append({
            "id": s.id,
            "student_name": s.student_name,
            "register_number": s.register_number,
            "department": s.department,
            "current_cgpa": float(s.current_cgpa or 0),
>>>>>>> 4c6ee56cea82c63d7a42f54ed23ff113b2f5a977
        })

    db.close()

<<<<<<< HEAD
    return result  
=======
    return result


# -------------------------------------------------
# Available Batches
# -------------------------------------------------
@app.get("/batches")
def get_batches():

    db = SessionLocal()

    batches = db.query(Student.batch).distinct().all()

    db.close()

    return [b[0] for b in batches if b[0]]
from sqlalchemy import desc, asc

@app.get("/report")
def get_report(
    batch: str,
    filter: str = "all",
    sort: str = "desc",
):

    db = SessionLocal()

    query = db.query(Student).filter(Student.batch == batch)

    if filter == "9":
        query = query.filter(Student.current_cgpa >= 9)

    elif filter == "8.5":
        query = query.filter(Student.current_cgpa >= 8.5)

    elif filter == "8":
        query = query.filter(Student.current_cgpa >= 8)

    elif filter == "7.5":
        query = query.filter(Student.current_cgpa >= 7.5)

    elif filter == "below7.5":
        query = query.filter(Student.current_cgpa < 7.5)

    if sort == "desc":
        query = query.order_by(desc(Student.current_cgpa))

    elif sort == "asc":
        query = query.order_by(asc(Student.current_cgpa))

    elif sort == "name":
        query = query.order_by(Student.student_name)

    elif sort == "reg":
        query = query.order_by(Student.register_number)

    students = query.all()

    result = []

    for s in students:
        result.append({
            "id": s.id,
            "student_name": s.student_name,
            "register_number": s.register_number,
            "department": s.department,
            "batch": s.batch,
            "current_cgpa": float(s.current_cgpa or 0),
        })

    db.close()

    return result
>>>>>>> 4c6ee56cea82c63d7a42f54ed23ff113b2f5a977
