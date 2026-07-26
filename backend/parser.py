import pdfplumber
import re


def parse_pdf(file_path):
    try:
        text = ""

        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        print("=" * 80)
        print(text)
        print("=" * 80)

        register_number = ""
        student_name = ""
        department = ""
        semester = ""
        subjects = []

        if not text.strip():
            return {
                "error": "Empty PDF",
                "message": "No text found in PDF"
            }

        # -------------------------------
        # Register Number
        # -------------------------------
        reg_match = re.search(r"Reg\s*No:?\s*([\d\s]+)", text)
        if reg_match:
            register_number = reg_match.group(1).replace(" ", "")

        # -------------------------------
        # Student Name
        # -------------------------------
        name_match = re.search(r"Name\s*:(.*?)Department", text, re.S)
        if name_match:
            student_name = " ".join(name_match.group(1).split())

        # -------------------------------
        # Department
        # -------------------------------
        dept_match = re.search(r"Department\s*:(.*?)DoB", text, re.S)
        if dept_match:
            department = " ".join(dept_match.group(1).split())

        # -------------------------------
        # Extract Lines
        # -------------------------------
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        print("========== LINES ==========")
        for line in lines:
            print(line)
        print("===========================")

        # -------------------------------
        # Subject Pattern
        # -------------------------------
        subject_pattern = re.compile(
            r"([1-8])\s+"
            r"(R\d+[A-Z]+\d+)\s+"
            r"(.+?)\s+"
            r"(O|A\+|A|B\+|B|C|U|RA|PASS)$"
        )

        for line in lines:

            line = " ".join(line.split())

            match = subject_pattern.match(line)

            if match:

                semester = match.group(1)

                subjects.append({
                    "code": match.group(2),
                    "name": match.group(3).strip(),
                    "grade": match.group(4)
                })

        print("Semester =", semester)
        print("Subjects Found =", len(subjects))
        print(subjects)

        return {
            "register_number": register_number,
            "student_name": student_name,
            "department": department,
            "semester": semester,
            "subjects": subjects
        }

    except Exception as e:
        print("Parser Error :", str(e))

        return {
            "error": str(e),
            "message": "PDF parsing failed"
        }