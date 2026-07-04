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
        # Extract Subjects
        # -------------------------------
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        i = 0

        while i < len(lines):

            line = " ".join(lines[i].split())

            # ------------------------------------------
            # FORMAT 3
            # 1 R21UEE128 ElectricalEngineeringLaboratory
            # O
            # ------------------------------------------
            if i + 1 < len(lines):

                next_line = lines[i + 1].strip()

                if next_line in ["O", "A+", "A", "B+", "B", "C", "PASS", "U"]:
                    line = line + " " + next_line

            # ------------------------------------------
            # FORMAT 1
            # 2 R21UMA208 SUBJECT NAME A+
            # ------------------------------------------
            match1 = re.match(
                r"([1-8])\s+(R\d+[A-Z]+\d+)\s+(.+?)\s+(PASS|O|A\+|A|B\+|B|C|U)$",
                line
            )

            if match1:

                semester = match1.group(1)

                subjects.append({
                    "code": match1.group(2),
                    "name": match1.group(3).strip(),
                    "grade": match1.group(4)
                })

                if i + 1 < len(lines):
                    nxt = lines[i + 1].strip()
                    if nxt in ["O", "A+", "A", "B+", "B", "C", "PASS", "U"]:
                        i += 2
                    else:
                        i += 1
                else:
                    i += 1

                continue

            # ------------------------------------------
            # FORMAT 2
            # R21UGM131 Subject Name
            # 1 PASS
            # ------------------------------------------
            if i + 1 < len(lines):

                current = " ".join(lines[i].split())
                nxt = " ".join(lines[i + 1].split())

                code_match = re.match(
                    r"(R\d+[A-Z]+\d+)\s+(.+)",
                    current
                )

                grade_match = re.match(
                    r"([1-8])\s+(PASS|O|A\+|A|B\+|B|C|U)$",
                    nxt
                )

                if code_match and grade_match:

                    semester = grade_match.group(1)

                    subjects.append({
                        "code": code_match.group(1),
                        "name": code_match.group(2).strip(),
                        "grade": grade_match.group(2)
                    })

                    i += 2
                    continue

            i += 1

        print("Semester =", semester)
        print("Subjects Found =", len(subjects))

        return {
            "register_number": register_number,
            "student_name": student_name,
            "department": department,
            "semester": semester,
            "subjects": subjects
        }

    except Exception as e:
        return {
            "error": str(e),
            "message": "PDF parsing failed"
        }