from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os

from parser import parse_pdf
from database import SessionLocal, engine, Base
from models import Student, SemesterResult, Subject
from cgpa import (
    get_grade_point,
    get_credit,
    calculate_gpa,
    calculate_cgpa
)

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "CGPA Calculator Backend Running Successfully"
    }


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

    if not data["semester"]:
        raise HTTPException(
            status_code=400,
            detail="Semester not found in the uploaded PDF."
        )

    # Add credit and grade point
    for subject in data["subjects"]:
        subject["credit"] = get_credit(subject["code"])
        subject["grade_point"] = get_grade_point(subject["grade"])

    # Calculate SGPA
    sgpa = calculate_gpa(data["subjects"])

    db = SessionLocal()

    # Check student
    student = db.query(Student).filter(
        Student.register_number == data["register_number"]
    ).first()

    if not student:
        student = Student(
            register_number=data["register_number"],
            student_name=data["student_name"],
            department=data["department"],
            current_semester=int(data["semester"]),
            current_cgpa=sgpa
        )

        db.add(student)
        db.commit()
        db.refresh(student)

    # Duplicate semester check
    existing_result = db.query(SemesterResult).filter(
        SemesterResult.student_id == student.id,
        SemesterResult.semester == int(data["semester"])
    ).first()

    if existing_result:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="This semester result is already uploaded."
        )

    # Save semester result
    semester_result = SemesterResult(
        student_id=student.id,
        semester=int(data["semester"]),
        sgpa=sgpa,
        result_pdf=file.filename
    )

    db.add(semester_result)
    db.commit()
    db.refresh(semester_result)

    # Save subjects
    for subject in data["subjects"]:
        subject_data = Subject(
            semester_result_id=semester_result.id,
            subject_code=subject["code"],
            subject_name=subject["name"],
            grade=subject["grade"],
            credit=subject["credit"],
            grade_point=subject["grade_point"]
        )

        db.add(subject_data)

    db.commit()

    # Calculate CGPA
    semester_results = db.query(SemesterResult).filter(
        SemesterResult.student_id == student.id
    ).all()

    cgpa = calculate_cgpa(semester_results)

    # Update student
    student.current_cgpa = cgpa
    student.current_semester = int(data["semester"])

    db.commit()
    db.close()

    return {
        "message": "PDF parsed and student saved successfully",
        "semester_gpa": sgpa,
        "current_cgpa": cgpa,
        "data": data
    }


# -----------------------------
# Get All Students
# -----------------------------
@app.get("/students")
def get_students():

    db = SessionLocal()

    students = db.query(Student).all()

    db.close()

    return students