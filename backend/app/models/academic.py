from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class AcademicYear(Base):
    __tablename__ = "academic_years"
    id = Column(Integer, primary_key=True, index=True)
    year_name = Column(String(50), nullable=False) # e.g. "2025-2026"
    is_current = Column(Boolean, default=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False) # e.g. "CS-401"
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="Computer Science")
    description = Column(Text, nullable=True)
    thumbnail = Column(String(500), nullable=True)
    credits = Column(Integer, default=4)
    rating = Column(Float, default=4.8)
    total_reviews = Column(Integer, default=120)
    is_featured = Column(Boolean, default=False)
    lead_teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    syllabus_json = Column(JSON, nullable=True) # list of modules/chapters
    schedule_info = Column(String(255), default="Mon/Wed/Fri 10:00 AM - 11:30 AM")
    created_at = Column(DateTime, default=datetime.utcnow)

class ClassEntity(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # e.g. "B.Tech CSE - Section A"
    batch_year = Column(String(50), default="2022-2026")
    semester = Column(Integer, default=6)
    department = Column(String(100), default="Computer Science & Engineering")
    mentor_teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Class Mentor
    created_at = Column(DateTime, default=datetime.utcnow)

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), nullable=False) # e.g. "CS601"
    name = Column(String(255), nullable=False) # e.g. "Database Management Systems"
    credits = Column(Integer, default=4)
    semester = Column(Integer, default=6)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False) # Subject Teacher
    syllabus_topics = Column(JSON, nullable=True) # ["ER Model", "Relational Algebra", "SQL", "Normalization", "Indexing", "Transactions"]
    notes_json = Column(JSON, nullable=True) # list of notes uploaded
    created_at = Column(DateTime, default=datetime.utcnow)

class SubjectAssessmentConfig(Base):
    __tablename__ = "subject_assessment_configs"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), unique=True, nullable=False)
    
    # Internal component configurator (/25 total target)
    has_internal_test = Column(Boolean, default=True)
    internal_test_max = Column(Float, default=10.0) # e.g. 10 marks
    
    has_model_exam = Column(Boolean, default=True)
    model_exam_max = Column(Float, default=5.0) # e.g. 5 marks
    
    has_assignment = Column(Boolean, default=True)
    assignment_max = Column(Float, default=5.0) # e.g. 5 marks
    
    has_seminar = Column(Boolean, default=True)
    seminar_max = Column(Float, default=2.5) # e.g. 2.5 marks
    
    has_project = Column(Boolean, default=True)
    project_max = Column(Float, default=2.5) # e.g. 2.5 marks
    
    total_internal_target = Column(Float, default=25.0)
    created_at = Column(DateTime, default=datetime.utcnow)
