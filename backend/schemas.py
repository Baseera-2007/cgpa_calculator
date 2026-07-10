from pydantic import BaseModel
from datetime import date


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