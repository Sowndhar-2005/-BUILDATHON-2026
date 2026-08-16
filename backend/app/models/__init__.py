from app.core.database import Base
from app.models.user import User, UserRole
from app.models.academic import AcademicYear, Course, ClassEntity, Subject, SubjectAssessmentConfig
from app.models.assessment import Assignment, AssignmentSubmission, Exam, StudentMark
from app.models.attendance import AttendanceRecord
from app.models.ai_insights import StudentAIAnalysis, DailyStudyTip

__all__ = [
    "Base",
    "User",
    "UserRole",
    "AcademicYear",
    "Course",
    "ClassEntity",
    "Subject",
    "SubjectAssessmentConfig",
    "Assignment",
    "AssignmentSubmission",
    "Exam",
    "StudentMark",
    "AttendanceRecord",
    "StudentAIAnalysis",
    "DailyStudyTip"
]
