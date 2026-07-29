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


# ---------------------------------------------------
# SGPA Calculation
# Formula:
# (Credit × Grade Point) / Earned Credits
# Earned Credits = Registered Credits - Failed Credits
# ---------------------------------------------------
def calculate_gpa(subjects):

    total_credit_points = 0
    earned_credits = 0

    for subject in subjects:

        credit = subject["credit"]
        grade = subject["grade"].upper()
        grade_point = subject["grade_point"]

        # Total Credit Points
        total_credit_points += credit * grade_point

        # Count only passed credits
        if grade not in ["RA", "U"]:
            earned_credits += credit

    if earned_credits == 0:
        return 0
    
    print("Total Credit Points =", total_credit_points)
    print("Earned Credits =", earned_credits)
    print("Raw SGPA =", total_credit_points / earned_credits)

    sgpa = total_credit_points / earned_credits

    return round(sgpa, 3)


# ---------------------------------------------------
# CGPA Calculation
# Average of all Semester SGPAs
# ---------------------------------------------------
def calculate_cgpa(semester_results):

    if not semester_results:
        return 0

    total = 0

    for result in semester_results:
        total += float(result.sgpa)

    cgpa = total / len(semester_results)

    return round(cgpa, 3)