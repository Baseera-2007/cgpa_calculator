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
    return GRADE_POINTS.get(
        grade.upper(),
        0
    )


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
    "R21UCB206": 2,
    "R21UEC225": 3,
    "R21UEN202": 2,
    "R21UCB211": 1,
    "R21UEC226": 1,
    "R21UGT241": 1,
    "R21UCB205": 3,


    # ---------- Semester 3 ----------
    "R21UCB301": 4,
    "R21UCB302": 3,
    "R21UCB307": 1,
    "R21UCB503": 2,
    "R21UCB862": 1,
    "R21UCS303": 3,
    "R21UCS305": 3,
    "R21UCS309": 1,
    "R21UGM331": 0,

    # ---------- Semester 4 ----------
    "R21UEN401": 2,
    "R21UCB863": 1,
    "R21UCB407": 1,
    "R21UCB408": 1,
    "R21UCB409": 1,
    "R21UGM431": 0,
    "R21UCB401": 3,
    "R21UCB402": 3,
    "R21UCB403": 3,
    "R21UCB404": 3,
    "R21UCB405": 3,
    "R21UCB406": 3,
    "R21U3N001": 3,

}


def get_credit(subject_code):

    return SUBJECT_CREDITS.get(
        subject_code,
        0
    )



# =====================================================
# SGPA Calculation
# =====================================================

def calculate_gpa(subjects):

    total_credit_points = 0
    total_credits = 0

    failed_credits = 0


    for subject in subjects:

        credit = subject["credit"]

        grade = subject["grade"].upper()

        grade_point = subject["grade_point"]



        # Ignore PASS subject with 0 credit
        if credit == 0:
            continue



        # Arrear subject
        if grade in ["RA", "U"]:
            continue



        total_credit_points += (
            credit * grade_point
        )

        total_credits += credit



    if total_credits == 0:

        return 0



    sgpa = (
        total_credit_points /
        total_credits
    )


    print(
        "Total Credit Points =",
        total_credit_points
    )

    print(
        "Earned Credits =",
        total_credits
    )

    print(
        "Failed Credits =",
        failed_credits
    )

    print(
        "SGPA =",
        sgpa
    )


    return round(
        sgpa,
        3
    )

#====================================================
# Arrear sgpa calculation
#=======================================================
def calculate_arrear_gpa(cleared_subjects):
    total_credit_points = 0
    total_credits = 0

    for subject in cleared_subjects:
        total_credit_points += subject["credit"] * subject["grade_point"]
        total_credits += subject["credit"]

    if total_credits == 0:
        return 0

    return round(total_credit_points / total_credits, 3)



# =====================================================
# CGPA Calculation
# =====================================================

def calculate_cgpa(semester_results):

    total_credit_points = 0
    total_credits = 0

    for semester in semester_results:

        for subject in semester.subjects:

            credit = subject.credit

            if credit == 0:
                continue

            grade = subject.grade.upper()

            if grade in ["RA", "U"]:
                continue

            grade_point = subject.grade_point

            total_credit_points += credit * grade_point
            total_credits += credit

    if total_credits == 0:
        return 0

    cgpa = total_credit_points / total_credits

    print("TOTAL CREDIT POINTS =", total_credit_points)
    print("TOTAL CREDITS =", total_credits)
    print("CGPA =", cgpa)

    return round(cgpa, 3)