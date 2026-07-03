import pdfplumber
import re


def parse_pdf(file_path):
    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    register_number = ""
    student_name = ""
    department = ""
    semester = ""
    subjects = []

    reg_match = re.search(r"Reg No:\s*(\d+)", text)
    if reg_match:
        register_number = reg_match.group(1)

    name_match = re.search(r"Name\s*:(.*?)Department", text, re.S)
    if name_match:
        student_name = name_match.group(1).strip()

    dept_match = re.search(r"Department\s*:(.*?)DoB", text, re.S)
    if dept_match:
        department = dept_match.group(1).strip()

    lines = text.split("\n")

    for line in lines:
        match = re.match(r"(\d+)\s+(R\d+\w+)\s+(.+)\s+(O|A\+|A|B\+|B|C|PASS|U)$", line)

        if match:
            semester = match.group(1)

            subjects.append({
                "code": match.group(2),
                "name": match.group(3),
                "grade": match.group(4)
            })

    return {
        "register_number": register_number,
        "student_name": student_name,
        "department": department,
        "semester": semester,
        "subjects": subjects
    }