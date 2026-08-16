from typing import Optional, List, Any, Dict
from datetime import datetime, date
from pydantic import BaseModel

class WeakSubjectItem(BaseModel):
    subject_id: int
    subject_code: str
    subject_name: str
    internal_score: float
    external_score: float
    final_score: float
    attendance_pct: float
    reasons: List[str]
    focus_topics: List[str]

class RecommendationItem(BaseModel):
    category: str
    priority: str
    action: str

class StudentAIAnalysisOut(BaseModel):
    id: int
    student_id: int
    risk_level: str
    risk_score: float
    overall_attendance_pct: float
    average_marks_pct: float
    assignment_completion_pct: float
    weak_subjects_json: Optional[List[Dict[str, Any]]] = None
    trend_status: str
    trend_analysis_text: Optional[str] = None
    recommendations_json: Optional[List[Dict[str, Any]]] = None
    summary_report_text: Optional[str] = None
    last_analyzed: datetime

    class Config:
        from_attributes = True

class DailyStudyTipOut(BaseModel):
    id: int
    title: str
    content: str
    category: str
    icon: str
    active_date: date

    class Config:
        from_attributes = True

class ClassAIOverviewOut(BaseModel):
    total_students: int
    at_risk_count: int
    average_class_attendance: float
    average_class_score: float
    risk_distribution: Dict[str, int]
    weak_subject_hotspots: List[Dict[str, Any]]
