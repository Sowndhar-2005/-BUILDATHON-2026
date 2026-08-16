from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel

class AttendanceRecordBase(BaseModel):
    student_id: int
    subject_id: int
    class_id: int
    date: date
    status: str = "present" # present, absent, late, excused
    remarks: Optional[str] = None

class AttendanceRecordCreate(AttendanceRecordBase):
    pass

class AttendanceBatchItem(BaseModel):
    student_id: int
    status: str = "present"
    remarks: Optional[str] = None

class AttendanceBatchCreate(BaseModel):
    subject_id: int
    class_id: int
    date: date
    records: List[AttendanceBatchItem]

class AttendanceRecordOut(AttendanceRecordBase):
    id: int
    recorded_by: int
    created_at: datetime

    class Config:
        from_attributes = True

class AttendanceSummary(BaseModel):
    student_id: int
    total_classes: int
    present_classes: int
    absent_classes: int
    attendance_percentage: float
    is_at_risk: bool # < 75%
