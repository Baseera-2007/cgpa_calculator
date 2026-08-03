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

from models import (
    User,
    Student,
    SemesterResult,
    Subject,
    Attendance,
    AssignedSubject,
    ArrearHistory
)



from datetime import date 
from cgpa import (
    get_grade_point,
    get_credit,
    calculate_gpa,
    calculate_arrear_gpa,
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
# Request Models
# ---------------------------------------

from typing import Optional

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str

    register_number: Optional[str] = None
    faculty_id: Optional[str] = None

    department: str
    batch: str
    section: str
    gender: str


class LoginRequest(BaseModel):
    username: str
    password: str


# ---------------------------------------
# Request Model
# ---------------------------------------

class StudentUpdate(BaseModel):
    student_name: str
    department: str
    batch: str
    section: str
    gender: str

class AttendanceCreate(BaseModel):
    student_id: int
    attendance_date: date
    status: str
    marked_by: str

class AssignedSubjectCreate(BaseModel):
    batch: str
    semester: int
    subject_code: str
    subject_name: str
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

# ------------------------------------------
# Upload PDF
# ------------------------------------------
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
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

    db = SessionLocal()

    try:

        student = db.query(Student).filter(
            Student.register_number == data["register_number"]
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        # ----------------------------------
        # Add Credits & Grade Points
        # ----------------------------------

        for subject in data["subjects"]:

            subject["credit"] = get_credit(
                subject["code"]
            )

            subject["grade_point"] = get_grade_point(
                subject["grade"]
            )

        uploaded_semesters = data["semesters_found"]

        for sem_no in uploaded_semesters:

            semester_subjects = [

                s for s in data["subjects"]

                if s["semester"] == sem_no

            ]

            semester = db.query(
                SemesterResult
            ).filter(

                SemesterResult.student_id == student.id,
                SemesterResult.semester == sem_no

            ).first()

            # ==================================
            # EXISTING SEMESTER (ARREAR UPLOAD)
            # ==================================

            if semester:

                print(
                    f"\nChecking Semester {sem_no} for arrears..."
                )

                print("CURRENT sem_no =", sem_no)

                cleared_subjects = []

                for uploaded in semester_subjects:

                    db_subject = db.query(
                        Subject
                    ).filter(

                        Subject.semester_result_id == semester.id,
                        Subject.subject_code == uploaded["code"]

                    ).first()

                    print("--------------------------------")
                    print("DB SUBJECT :", db_subject.subject_code if db_subject else "NOT FOUND")
                    print("UPLOADED   :", uploaded["code"])
                    print("--------------------------------")

                    if not db_subject:
                        print("NOT FOUND IN DATABASE:", uploaded["code"])
                        continue

                    old_grade = db_subject.grade.upper()
                    new_grade = uploaded["grade"].upper()

                    print("===================================")
                    print("CODE      :", uploaded["code"])
                    print("OLD GRADE :", old_grade)
                    print("NEW GRADE :", new_grade)
                    print("===================================")

                    # Arrear Cleared

                    if old_grade in ["RA", "U"] and new_grade not in ["RA", "U"]:

                        print("===================================")
                        print("UPLOADED SUBJECT:")
                        print(uploaded)
                        print("===================================")

                        print(
                            "ARREAR CLEARED :",
                            db_subject.subject_code,
                            old_grade,
                            "->",
                            new_grade
                        )

                        db_subject.grade = new_grade

                        db_subject.grade_point = uploaded["grade_point"]

                        print(uploaded)

                        cleared_subjects.append({
                            "semester": uploaded["semester"],

                            "code": db_subject.subject_code,

                            "name": db_subject.subject_name,

                            "credit": db_subject.credit,

                            "grade": new_grade,

                            "grade_point": uploaded["grade_point"]

                        })

                db.commit()

                

                # ----------------------------------
                # Recalculate Entire Semester SGPA
                # ----------------------------------

                semester_subjects_db = db.query(
                    Subject
                ).filter(
                    Subject.semester_result_id == semester.id
                ).all()

                recalculate_subjects = []

                for sub in semester_subjects_db:

                    recalculate_subjects.append({

                        "code": sub.subject_code,
                        "grade": sub.grade,
                        "credit": sub.credit,
                        "grade_point": sub.grade_point

                    })

                # Update Semester SGPA
                semester.sgpa = calculate_gpa(
                    recalculate_subjects
                )

                print(
                    f"UPDATED SEM {sem_no} SGPA =",
                    semester.sgpa
                )

                # ----------------------------------
                # Calculate Arrear GPA
                # ----------------------------------

                arrear_gpa = 0

                if len(cleared_subjects) > 0:

                    arrear_gpa = calculate_arrear_gpa(
                        cleared_subjects
                    )

                    print(
                        "ARREAR GPA =",
                        arrear_gpa
                    )

                    # ----------------------------------
                    # TODO:
                    # Save arrear history here
                    # (We'll connect this to the popup UI later.)
                    # ----------------------------------
                    
                    for subject in cleared_subjects:

                        print("Saving with cleared_in_semester =", sem_no)

                        # Check whether history already exists
                        existing_history = db.query(ArrearHistory).filter(
                            ArrearHistory.student_id == student.id,
                            ArrearHistory.subject_code == subject["code"]
                        ).first()

                        if existing_history:
                            print("History already exists:", subject["code"])
                            continue

                        history = ArrearHistory(

                            student_id=student.id,

                            semester = subject["semester"],

                            subject_code=subject["code"],

                            subject_name=subject["name"],

                            old_grade="RA",

                            new_grade=subject["grade"],

                            credit=subject["credit"],

                            grade_point=subject["grade_point"],

                            arrear_gpa=arrear_gpa,

                            cleared_in_semester=sem_no

                        )

                        print("Saving history:", history.subject_code)

                        db.add(history)

                    db.commit()


            # ==================================
            # NEW SEMESTER
            # ==================================

            else:

                semester = SemesterResult(

                    student_id=student.id,

                    semester=sem_no,

                    result_pdf=file.filename

                )

                db.add(semester)

                db.commit()

                db.refresh(semester)

                for subject in semester_subjects:

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

                subjects = db.query(
                    Subject
                ).filter(
                    Subject.semester_result_id == semester.id
                ).all()

                calc = []

                for sub in subjects:

                    calc.append({

                        "code": sub.subject_code,
                        "grade": sub.grade,
                        "credit": sub.credit,
                        "grade_point": sub.grade_point

                    })

                semester.sgpa = calculate_gpa(
                    calc
                )

                db.commit()

        # ==================================
        # UPDATE STUDENT CGPA
        # ==================================

        all_semesters = db.query(
            SemesterResult
        ).filter(
            SemesterResult.student_id == student.id
        ).all()

        student.current_semester = max(
            s.semester for s in all_semesters
        )

        student.current_cgpa = calculate_cgpa(
            all_semesters
        )

        db.commit()

        return {

            "message": "Result processed successfully",

            "current_cgpa": float(
                student.current_cgpa
            )

        }

    except Exception as e:

        db.rollback()

        print(
            "UPLOAD ERROR:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )

    finally:

        db.close()

#==============================================
# Arrear popup history
#==============================================
@app.get("/student/{student_id}/arrear-history")
def get_arrear_history(student_id: int):
    db = SessionLocal()

    try:

        history = (
            db.query(ArrearHistory)
            .filter(ArrearHistory.student_id == student_id)
            .order_by(ArrearHistory.id)
            .all()
        )

        history = [
            h for h in history
            if h.old_grade != h.new_grade
        ]

        # Current backlog subjects
        current_backlogs = (
            db.query(Subject)
            .join(SemesterResult)
            .filter(
                SemesterResult.student_id == student_id,
                Subject.grade.in_(["RA", "U", "F", "FAIL"])
            )
            .all()
        )

        current_codes = {
            sub.subject_code
            for sub in current_backlogs
        }

        return [
            {
                "id": h.id,
                "semester": h.semester,
                "subject_code": h.subject_code,
                "subject_name": h.subject_name,
                "old_grade": h.old_grade,
                "new_grade": h.new_grade,
                "credit": h.credit,
                "grade_point": h.grade_point,
                "arrear_gpa": float(h.arrear_gpa),
                "cleared_in_semester": h.cleared_in_semester,
                "is_current_backlog": h.subject_code in current_codes
            }
            for h in history
        ]

    finally:
        db.close()
        
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
        "current_cgpa": float(student.current_cgpa) if student.current_cgpa is not None else 0.0,
        "semester_results": []
    }

    for semester in student.semester_results:

        sem = {
            "id": semester.id,
            "semester": semester.semester,
            "sgpa": float(semester.sgpa) if semester.sgpa is not None else 0.0,
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

@app.delete("/semester/{semester_id}")
def delete_semester(semester_id: int):

    db = SessionLocal()
    
    all_semesters = db.query(SemesterResult).all()

    print("All semester IDs:")
    for sem in all_semesters:
        print(sem.id, sem.semester, sem.student_id)

    semester = db.query(SemesterResult).filter(
        SemesterResult.id == semester_id
    ).first()

    print("Deleting semester id:", semester_id)
    print("Found semester:", semester)

    if not semester:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Semester not found"
        )

    student = semester.student

    db.delete(semester)
    db.commit()

    remaining = db.query(SemesterResult).filter(
        SemesterResult.student_id == student.id
    ).all()

    if remaining:

        student.current_semester = max(
            sem.semester for sem in remaining
        )

        student.current_cgpa = calculate_cgpa(remaining)

    else:

        student.current_semester = 0
        student.current_cgpa = 0

    db.commit()
    db.close()

    return {
        "message": "Semester deleted successfully"
    }
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

# ==========================================
# GET ALL ASSIGNED SUBJECTS
# ==========================================
@app.get("/assigned-subjects/all")
def get_all_assigned_subjects():
    db = SessionLocal()

    try:
        subjects = (
            db.query(AssignedSubject)
            .order_by(AssignedSubject.subject_code)
            .all()
        )

        return subjects

    finally:
        db.close()
        
            
@app.get("/subjects/{semester}")
def get_subjects(semester: int):

    if semester not in SUBJECTS:
        return []

    return SUBJECTS[semester]