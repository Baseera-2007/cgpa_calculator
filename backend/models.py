from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base


# ==========================================
# Student Table
# ==========================================
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    register_number = Column(String, unique=True, nullable=False)
    student_name = Column(String, nullable=False)
    department = Column(String)

    # Academic Details
    batch = Column(String)
    section = Column(String)
    class_batch = Column(String)      # Batch I / Batch II
    gender = Column(String)

    # CGPA Details
    current_semester = Column(Integer)
    current_cgpa = Column(DECIMAL(4, 2))

    semester_results = relationship(
        "SemesterResult",
        back_populates="student",
        cascade="all, delete-orphan"
    )


# ==========================================
# Semester Result Table
# ==========================================
class SemesterResult(Base):
    __tablename__ = "semester_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    semester = Column(Integer)
    sgpa = Column(DECIMAL(4, 2))
    result_pdf = Column(String)

    student = relationship(
        "Student",
        back_populates="semester_results"
    )

    subjects = relationship(
        "Subject",
        back_populates="semester_result",
        cascade="all, delete-orphan"
    )


# ==========================================
# Subject Table
# ==========================================
class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    semester_result_id = Column(Integer, ForeignKey("semester_results.id"))
    subject_code = Column(String)
    subject_name = Column(String)
    grade = Column(String)
    credit = Column(Integer)
    grade_point = Column(Integer)

    semester_result = relationship(
        "SemesterResult",
        back_populates="subjects"
    )


# ==========================================
# Attendance Table
# ==========================================
class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    attendance_date = Column(Date)
    status = Column(String)          # Present / Absent / OD
    marked_by = Column(String)       # Teacher Name

    student = relationship("Student")