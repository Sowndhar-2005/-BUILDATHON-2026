from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel

# Course Schemas
class CourseBase(BaseModel):
    code: str
    title: str
    category: str = "Computer Science"
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    credits: int = 4
    rating: float = 4.8
    total_reviews: int = 120
    is_featured: bool = False
    lead_teacher_id: Optional[int] = None
    syllabus_json: Optional[Any] = None
    schedule_info: Optional[str] = "Mon/Wed/Fri 10:00 AM - 11:30 AM"

class CourseCreate(CourseBase):
    pass

class CourseOut(CourseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Class Schemas
class ClassBase(BaseModel):
    name: str
    batch_year: str = "2022-2026"
    semester: int = 6
    department: str = "Computer Science & Engineering"
    mentor_teacher_id: Optional[int] = None

class ClassCreate(ClassBase):
    pass

class ClassOut(ClassBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Subject Schemas
class SubjectBase(BaseModel):
    code: str
    name: str
    credits: int = 4
    semester: int = 6
    class_id: int
    teacher_id: int
    syllabus_topics: Optional[List[str]] = None
    notes_json: Optional[Any] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectOut(SubjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Subject Assessment Config
class AssessmentConfigBase(BaseModel):
    subject_id: int
    has_internal_test: bool = True
    internal_test_max: float = 10.0
    has_model_exam: bool = True
    model_exam_max: float = 5.0
    has_assignment: bool = True
    assignment_max: float = 5.0
    has_seminar: bool = True
    seminar_max: float = 2.5
    has_project: bool = True
    project_max: float = 2.5
    total_internal_target: float = 25.0

class AssessmentConfigCreate(AssessmentConfigBase):
    pass

class AssessmentConfigOut(AssessmentConfigBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
