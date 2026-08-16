from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel

class AssignmentBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    max_score: float = 100.0
    due_date: datetime
    attachments_json: Optional[Any] = None

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentOut(AssignmentBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True

class SubmissionBase(BaseModel):
    assignment_id: int
    submission_text: Optional[str] = None
    file_url: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionGrade(BaseModel):
    score: float
    teacher_feedback: Optional[str] = None

class SubmissionOut(SubmissionBase):
    id: int
    student_id: int
    submitted_at: datetime
    score: Optional[float] = None
    teacher_feedback: Optional[str] = None
    ai_feedback: Optional[str] = None
    ai_plagiarism_score: Optional[float] = 0.0
    status: str

    class Config:
        from_attributes = True

class ExamBase(BaseModel):
    subject_id: int
    exam_type: str # internal_test, model_exam, external_semester
    title: str
    total_marks: float = 100.0
    exam_date: datetime
    room_no: Optional[str] = "Hall-A"

class ExamCreate(ExamBase):
    pass

class ExamOut(ExamBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class StudentMarkEntry(BaseModel):
    student_id: int
    subject_id: int
    semester: int = 6
    internal_test_score: Optional[float] = 0.0
    model_exam_score: Optional[float] = 0.0
    assignment_score: Optional[float] = 0.0
    seminar_score: Optional[float] = 0.0
    project_score: Optional[float] = 0.0
    external_raw_100: Optional[float] = 0.0
    remarks: Optional[str] = None

class StudentMarkOut(BaseModel):
    id: int
    student_id: int
    subject_id: int
    semester: int
    internal_test_score: float
    model_exam_score: float
    assignment_score: float
    seminar_score: float
    project_score: float
    internal_total_25: float
    external_raw_100: float
    external_converted_75: float
    final_mark_100: float
    letter_grade: str
    grade_points: float
    is_passed: bool
    remarks: Optional[str] = None

    class Config:
        from_attributes = True
