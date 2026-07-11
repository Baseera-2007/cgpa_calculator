from fastapi.responses import FileResponse
from openpyxl import Workbook
import os
from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import Student
from sqlalchemy import desc, asc
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors

router = APIRouter()


@router.get("/report")
def get_report(
    batch: str,
    filter: str = "all",
    sort: str = "desc"
):

    db = SessionLocal()

    students = db.query(Student).filter(
        Student.batch == batch
    ).all()

    result = []

    for student in students:

        cgpa = float(student.current_cgpa or 0)

        if filter == "9" and cgpa < 9:
            continue

        elif filter == "8.5" and cgpa < 8.5:
            continue

        elif filter == "8" and cgpa < 8:
            continue

        elif filter == "7.5" and cgpa < 7.5:
            continue

        elif filter == "below7.5" and cgpa >= 7.5:
            continue

        result.append({
            "id": student.id,
            "register_number": student.register_number,
            "student_name": student.student_name,
            "department": student.department,
            "batch": student.batch,
            "current_cgpa": cgpa
        })

    if sort == "desc":
        result.sort(key=lambda x: x["current_cgpa"], reverse=True)

    elif sort == "asc":
        result.sort(key=lambda x: x["current_cgpa"])

    elif sort == "name":
        result.sort(key=lambda x: x["student_name"])

    elif sort == "reg":
        result.sort(key=lambda x: x["register_number"])

    db.close()

    return result
@router.get("/dashboard")
def get_dashboard(batch: str):

    db = SessionLocal()

    students = db.query(Student).filter(
        Student.batch == batch
    ).all()

    total_students = len(students)

    if total_students == 0:
        db.close()
        return {
            "total_students": 0,
            "average_cgpa": 0,
            "highest_cgpa": 0,
            "lowest_cgpa": 0,
            "above9": 0,
            "pass_percentage": 0,
            "top_students": []
        }

    cgpas = [float(student.current_cgpa or 0) for student in students]

    average_cgpa = round(sum(cgpas) / total_students, 2)

    highest_cgpa = max(cgpas)

    lowest_cgpa = min(cgpas)

    above9 = len([cgpa for cgpa in cgpas if cgpa >= 9])

    top_students = sorted(
        students,
        key=lambda x: float(x.current_cgpa or 0),
        reverse=True
    )[:5]

    top_students_data = []

    for student in top_students:
        top_students_data.append({
            "student_name": student.student_name,
            "current_cgpa": float(student.current_cgpa or 0)
        })

    db.close()

    return {
        "total_students": total_students,
        "average_cgpa": average_cgpa,
        "highest_cgpa": highest_cgpa,
        "lowest_cgpa": lowest_cgpa,
        "above9": above9,
        "pass_percentage": 100,
        "top_students": top_students_data
    }
@router.get("/export-excel")
def export_excel(batch: str):

    db = SessionLocal()

    students = db.query(Student).filter(
        Student.batch == batch
    ).all()

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Academic Report"

    sheet.append([
        "Register Number",
        "Student Name",
        "Department",
        "Batch",
        "CGPA"
    ])

    for student in students:
        sheet.append([
            student.register_number,
            student.student_name,
            student.department,
            student.batch,
            float(student.current_cgpa or 0)
        ])

    os.makedirs("reports", exist_ok=True)

    file_path = f"reports/{batch}_Academic_Report.xlsx"

    workbook.save(file_path)

    db.close()

    return FileResponse(
        path=file_path,
        filename=f"{batch}_Academic_Report.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
@router.get("/export-pdf")
def export_pdf(batch: str):

    db = SessionLocal()

    students = db.query(Student).filter(
        Student.batch == batch
    ).all()

    os.makedirs("reports", exist_ok=True)

    file_path = f"reports/{batch}_Academic_Report.pdf"

    pdf = SimpleDocTemplate(file_path)

    data = [[
        "Register No",
        "Name",
        "Department",
        "Batch",
        "CGPA"
    ]]

    for student in students:
        data.append([
            student.register_number,
            student.student_name,
            student.department,
            student.batch,
            str(float(student.current_cgpa or 0))
        ])

    table = Table(data)

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
    ]))

    pdf.build([table])

    db.close()

    return FileResponse(
        path=file_path,
        filename=f"{batch}_Academic_Report.pdf",
        media_type="application/pdf"
    )
