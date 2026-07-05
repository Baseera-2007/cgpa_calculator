from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    register_number = Column(String, unique=True, nullable=False)
    student_name = Column(String, nullable=False)
    department = Column(String)
    batch = Column(String)
    section = Column(String)
    current_semester = Column(Integer)
    current_cgpa = Column(DECIMAL(4, 2))

    semester_results = relationship(
        "SemesterResult",
        back_populates="student",
        cascade="all, delete-orphan"
    )


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