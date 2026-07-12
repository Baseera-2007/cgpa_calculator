from pydantic import BaseModel
from datetime import date
from typing import Optional

# ==========================================
# Signup
# ==========================================

class SignupRequest(BaseModel):
    username: str
    department: str

    role: str

    register_number: Optional[str] = None
    faculty_id: Optional[str] = None

    batch: Optional[str] = None
    section: Optional[str] = None
    gender: Optional[str] = None

    email: Optional[str] = None

    password: str


# ==========================================
# Login
# ==========================================

class LoginRequest(BaseModel):
    username: str
    password: str


# ==========================================
# Attendance
# ==========================================

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