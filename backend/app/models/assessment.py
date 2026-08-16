from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, JSON
from app.core.database import Base

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    max_score = Column(Float, default=100.0)
    due_date = Column(DateTime, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    attachments_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submission_text = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    score = Column(Float, nullable=True) # Awarded marks
    teacher_feedback = Column(Text, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    ai_plagiarism_score = Column(Float, default=0.0)
    status = Column(String(50), default="submitted") # submitted, graded, late

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    exam_type = Column(String(50), nullable=False) # internal_test, model_exam, external_semester
    title = Column(String(255), nullable=False)
    total_marks = Column(Float, default=100.0) # Raw exam scale (e.g. 50 or 100)
    exam_date = Column(DateTime, nullable=False)
    room_no = Column(String(50), default="Hall-A")
    created_at = Column(DateTime, default=datetime.utcnow)

class StudentMark(Base):
    __tablename__ = "student_marks"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    semester = Column(Integer, default=6)
    
    # Internal component scores (raw and normalized to config)
    internal_test_score = Column(Float, default=0.0)
    model_exam_score = Column(Float, default=0.0)
    assignment_score = Column(Float, default=0.0)
    seminar_score = Column(Float, default=0.0)
    project_score = Column(Float, default=0.0)
    
    # Internal mark out of 25 (Calculated dynamically or recorded)
    internal_total_25 = Column(Float, default=0.0)
    
    # External semester exam out of 100
    external_raw_100 = Column(Float, default=0.0)
    
    # Converted External Mark out of 75 (external_raw_100 * 0.75)
    external_converted_75 = Column(Float, default=0.0)
    
    # Final Subject Mark out of 100 (internal_total_25 + external_converted_75)
    final_mark_100 = Column(Float, default=0.0)
    
    letter_grade = Column(String(10), default="F") # O, A+, A, B+, B, C, F
    grade_points = Column(Float, default=0.0) # 10.0, 9.0, 8.0, 7.0, etc.
    is_passed = Column(Boolean, default=False)
    remarks = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
