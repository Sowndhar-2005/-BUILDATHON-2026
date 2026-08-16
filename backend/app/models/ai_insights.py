from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Float, ForeignKey, Text, JSON
from app.core.database import Base

class StudentAIAnalysis(Base):
    __tablename__ = "student_ai_analyses"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Computed metrics
    risk_level = Column(String(20), default="low") # low, medium, high, critical
    risk_score = Column(Float, default=15.0) # 0 to 100
    overall_attendance_pct = Column(Float, default=90.0)
    average_marks_pct = Column(Float, default=78.0)
    assignment_completion_pct = Column(Float, default=95.0)
    
    # Analysis outputs
    weak_subjects_json = Column(JSON, nullable=True) # [{"subject": "DBMS", "internal": 14, "external": 52, "reason": "Low attendance (68%) and struggling with Normalization"}]
    trend_status = Column(String(50), default="improving") # improving, declining, stable
    trend_analysis_text = Column(Text, nullable=True)
    
    recommendations_json = Column(JSON, nullable=True) # list of structured tips & action items
    summary_report_text = Column(Text, nullable=True)
    
    last_analyzed = Column(DateTime, default=datetime.utcnow)

class DailyStudyTip(Base):
    __tablename__ = "daily_study_tips"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), default="Cognitive Retention") # Time Management, Revision, Problem Solving
    icon = Column(String(50), default="brain")
    active_date = Column(Date, default=date.today)
