GRADE_POINTS = {
    "O": 10,
    "A+": 9,
    "A": 8,
    "B+": 7,
    "B": 6,
    "C": 5,
    "PASS": 0,
    "U": 0,
    "RA": 0
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
    "R21UPH113": 1,

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
    "R21UCB301": 4,
    "R21UCB302": 3,
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


# ---------------------------------------------------
# SGPA Calculation
# Formula:
# (Credit × Grade Point) / Earned Credits
# Earned Credits = Registered Credits - Failed Credits
# ---------------------------------------------------
def calculate_gpa(subjects):

    total_credit_points = 0
    total_registered_credits = 0
    failed_credits = 0

    for subject in subjects:

        credit = subject["credit"]
        grade = subject["grade"].upper()
        grade_point = subject["grade_point"]

        total_registered_credits += credit
        total_credit_points += credit * grade_point

        if grade in ["RA", "U"]:
            failed_credits += credit

    earned_credits = total_registered_credits - failed_credits

    if earned_credits == 0:
        return 0

    sgpa = total_credit_points / earned_credits

    print("Total Credit Points =", total_credit_points)
    print("Registered Credits =", total_registered_credits)
    print("Failed Credits =", failed_credits)
    print("Earned Credits =", earned_credits)
    print("SGPA =", sgpa)

    return round(sgpa, 3)
# ---------------------------------------------------
# CGPA Calculation
# Average of all Semester SGPAs
# ---------------------------------------------------
def calculate_cgpa(semester_results):

    total_credit_points = 0
    total_earned_credits = 0

    for semester in semester_results:

        for subject in semester.subjects:

            grade = subject.grade.upper()
            credit = subject.credit
            grade_point = subject.grade_point

            total_credit_points += credit * grade_point

            if grade not in ["RA", "U"]:
                total_earned_credits += credit

    if total_earned_credits == 0:
        return 0

    cgpa = total_credit_points / total_earned_credits

    print("CGPA =", cgpa)

    return round(cgpa, 3)