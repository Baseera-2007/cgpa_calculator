from subjects_master import SUBJECTS
from report import router as report_router
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os

from parser import parse_pdf
from database import SessionLocal, engine, Base

from models import User, Student, SemesterResult, Subject, Attendance, AssignedSubject

from schemas import (
    AttendanceCreate,
    SignupRequest,
    LoginRequest,
    AssignedSubjectCreate,
    AssignedSubjectResponse,
)



from datetime import date 
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

app.include_router(report_router)

# ---------------------------------------
# Signup
# ---------------------------------------
# ---------------------------------------
# Signup
# ---------------------------------------
@app.post("/signup")
def signup(user: SignupRequest):

    db = SessionLocal()

    try:

        # -----------------------------
        # Username already exists?
        # -----------------------------
        existing = db.query(User).filter(
            User.username == user.username
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Username already exists"
            )

        # -----------------------------
        # Student Validation
        # -----------------------------
        if user.role == "student":

            if not user.register_number:
                raise HTTPException(
                    status_code=400,
                    detail="Register Number is required."
                )

            existing_student = db.query(Student).filter(
                Student.register_number == user.register_number
            ).first()

            if existing_student:
                raise HTTPException(
                    status_code=400,
                    detail="Student already registered."
                )

        # -----------------------------
        # Staff Validation
        # -----------------------------
        elif user.role == "staff":

            if not user.faculty_id:
                raise HTTPException(
                    status_code=400,
                    detail="Faculty ID is required."
                )

            existing_staff = db.query(User).filter(
                User.faculty_id == user.faculty_id
            ).first()

            if existing_staff:
                raise HTTPException(
                    status_code=400,
                    detail="Faculty ID already exists."
                )

        # -----------------------------
        # Save User
        # -----------------------------
        new_user = User(
            username=user.username,
            email=user.email,
            register_number=user.register_number,
            faculty_id=user.faculty_id,
            department=user.department,
            password=user.password,
            role=user.role,
            batch=user.batch,
            section=user.section,
            gender=user.gender
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # -----------------------------
        # Student Table
        # -----------------------------
        if user.role == "student":

            new_student = Student(
                register_number=user.register_number,
                student_name=user.username,
                department=user.department,
                batch=user.batch,
                section=user.section,
                gender=user.gender,
                current_semester=0,
                current_cgpa=0.0
            )

            db.add(new_student)
            db.commit()

        return {
            "message": "Signup Successful"
        }

    except HTTPException as e:
        db.rollback()
        raise e

    except Exception as e:
        db.rollback()
        print("SIGNUP ERROR :", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        db.close()

# ---------------------------------------
# Login
# ---------------------------------------
@app.post("/login")
def login(login: LoginRequest):

    db = SessionLocal()

    user = db.query(User).filter(
        User.username == login.username,
        User.password == login.password
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid Username or Password"
        )

    response = {
        "username": user.username,
        "role": user.role,
        "register_number": user.register_number
    }

    db.close()

    return response
# ---------------------------------------
# Request Model
# ---------------------------------------
class StudentUpdate(BaseModel):
    student_name: str
    department: str
    batch: str
    section: str
    gender: str





# ---------------------------------------
# Upload PDF
# ---------------------------------------
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    data = parse_pdf(file_path)
    print("========== PDF DATA ==========")
    print(data)
    print("==============================")

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

        db.close()

        raise HTTPException(
            status_code=404,
            detail="Student not found. Please signup first."
        )

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

    semester = SemesterResult(
        student_id=student.id,
        semester=int(data["semester"]),
        sgpa=sgpa,
        result_pdf=file.filename
    )

    db.add(semester)
    db.commit()
    db.refresh(semester)

    for subject in data["subjects"]:

        db.add(
            Subject(
                semester_result_id=semester.id,
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

    db.close()

    return {
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
    ).all()

    result = []

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
        })

    db.close()

    return result  
# test
# ==========================================
# ADD SUBJECT
# ==========================================
@app.post("/assigned-subjects")
def add_subject(subject: AssignedSubjectCreate):

    db = SessionLocal()

    existing = db.query(AssignedSubject).filter(
        AssignedSubject.batch == subject.batch,
        AssignedSubject.semester == subject.semester,
        AssignedSubject.subject_code == subject.subject_code
    ).first()

    if existing:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Subject already exists."
        )

    new_subject = AssignedSubject(
        batch=subject.batch,
        semester=subject.semester,
        subject_code=subject.subject_code,
        subject_name=subject.subject_name
    )

    db.add(new_subject)
    db.commit()

    db.close()

    return {
        "message": "Subject added successfully."
    }


# ==========================================
# GET SUBJECTS
# ==========================================
@app.get("/assigned-subjects")
def get_subjects(batch: str, semester: int):

    db = SessionLocal()

    subjects = db.query(AssignedSubject).filter(
        AssignedSubject.batch == batch,
        AssignedSubject.semester == semester
    ).all()

    db.close()

    return subjects


# ==========================================
# DELETE SUBJECT
# ==========================================
@app.delete("/assigned-subjects/{subject_id}")
def delete_subject(subject_id: int):

    db = SessionLocal()

    subject = db.query(AssignedSubject).filter(
        AssignedSubject.id == subject_id
    ).first()

    if not subject:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Subject not found."
        )

    db.delete(subject)
    db.commit()

    db.close()

    return {
        "message": "Subject deleted successfully."
    }
    
@app.get("/subjects/{semester}")
def get_subjects(semester: int):

    if semester not in SUBJECTS:
        return []

    return SUBJECTS[semester]