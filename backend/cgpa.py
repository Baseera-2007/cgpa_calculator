GRADE_POINTS = {
    "O": 10,
    "A+": 9,
    "A": 8,
    "B+": 7,
    "B": 6,
    "C": 5,
    "PASS": 0,
    "U": 0
}


def get_grade_point(grade):
    return GRADE_POINTS.get(grade.upper(), 0)


SUBJECT_CREDITS = {

    # ---------- Semester 1 ----------

    "R21UGM131": 0,
    "R21UMA103": 4,
    "R21UMA104": 3,
    "R21UPH103": 3,
    "R21UCS107": 3,
    "R21UEE125": 3,
    "R21UEN102": 2,
    "R21UGT140": 1,
    "R21UCS111": 1,
    "R21UEE128": 1,

    # ---------- Semester 2 ----------

    "R21UAC231": 0,
    "R21UMA208": 4,
    "R21UMA209": 4,
    "R21UCB206": 3,
    "R21UEC225": 3,
    "R21UEN202": 2,
    "R21UCB211": 1,
    "R21UEC226": 1,
    "R21UGT241": 1,
    "R21UCB205": 3,

    # ---------- Semester 3 ----------

    "R21UCB301": 3,
    "R21UCB302": 4,
    "R21UCB307": 2,
    "R21UCB503": 3,
    "R21UCB862": 2,
    "R21UCS303": 3,
    "R21UCS305": 3,
    "R21UCS309": 2,
    "R21UGM331": 0,
}


def get_credit(subject_code):
    return SUBJECT_CREDITS.get(subject_code, 0)


def calculate_gpa(subjects):
    total_credit_points = 0
    total_credits = 0

    for subject in subjects:
        credit = subject["credit"]
        grade_point = subject["grade_point"]

        total_credit_points += credit * grade_point
        total_credits += credit

    if total_credits == 0:
        return 0

    return round(total_credit_points / total_credits, 2)


def calculate_cgpa(semester_results):
    if not semester_results:
        return 0

    total_sgpa = 0

    for result in semester_results:
        total_sgpa += float(result.sgpa)

    cgpa = total_sgpa / len(semester_results)

    return round(cgpa, 2)