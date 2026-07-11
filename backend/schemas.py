from pydantic import BaseModel
from datetime import date


# ----------------------------
# Login
# ----------------------------
class LoginRequest(BaseModel):
    username: str
    password: str


# ----------------------------
# Signup
# ----------------------------
class SignupRequest(BaseModel):
    username: str
    department: str
    role: str

    register_number: str | None = None
    faculty_id: str | None = None

    batch: str | None = None
    section: str | None = None
    gender: str | None = None

    email: str | None = None

    password: str


# ----------------------------
# Attendance
# ----------------------------
class AttendanceCreate(BaseModel):
    student_id: int
    attendance_date: date
    status: str
    marked_by: str


class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    attendance_date: date
    status: str
    marked_by: str

    class Config:
        from_attributes = True