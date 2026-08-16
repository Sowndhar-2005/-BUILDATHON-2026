from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User
from app.models.academic import Subject, ClassEntity
from app.models.assessment import StudentMark
from app.models.attendance import AttendanceRecord
from app.models.ai_insights import StudentAIAnalysis
from app.services.ai_service import ai_service
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/student/{student_id}")
async def generate_student_performance_report(
    student_id: int,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Generates Section 10 Performance Report & Summary:
    1. Academic Performance Summary
    2. Weak Areas Identified
    3. Risk Analysis
    4. AI Recommendations
    5. Download / Print Data
    """
    user_q = await db.execute(select(User).where(User.id == student_id))
    student = user_q.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    # Run/fetch AI analysis
    analysis = await ai_service.analyze_student_performance(db, student_id)
    
    # Fetch detailed subject marks
    marks_q = await db.execute(
        select(StudentMark, Subject).join(Subject, StudentMark.subject_id == Subject.id).where(StudentMark.student_id == student_id)
    )
    marks_records = []
    for mark, subj in marks_q.all():
        marks_records.append({
            "subject_code": subj.code,
            "subject_name": subj.name,
            "credits": subj.credits,
            "internal_test": mark.internal_test_score,
            "model_exam": mark.model_exam_score,
            "assignments": mark.assignment_score,
            "seminar": mark.seminar_score,
            "project": mark.project_score,
            "internal_total_25": mark.internal_total_25,
            "external_raw_100": mark.external_raw_100,
            "external_converted_75": mark.external_converted_75,
            "final_mark_100": mark.final_mark_100,
            "letter_grade": mark.letter_grade,
            "grade_points": mark.grade_points,
            "is_passed": mark.is_passed,
            "remarks": mark.remarks
        })
        
    return {
        "student": {
            "id": student.id,
            "full_name": student.full_name,
            "email": student.email,
            "enrollment_number": student.enrollment_number or f"STU-{student.id:04d}",
            "department": student.department or "Computer Science & Engineering",
            "semester": 6
        },
        "performance_summary": {
            "overall_attendance_pct": analysis.overall_attendance_pct,
            "average_marks_pct": analysis.average_marks_pct,
            "risk_level": analysis.risk_level,
            "risk_score": analysis.risk_score,
            "trend_status": analysis.trend_status,
            "trend_analysis_text": analysis.trend_analysis_text,
            "summary_narrative": analysis.summary_report_text
        },
        "subject_marks": marks_records,
        "weak_areas_identified": analysis.weak_subjects_json or [],
        "ai_recommendations": analysis.recommendations_json or [],
        "report_generated_at": analysis.last_analyzed.isoformat()
    }
