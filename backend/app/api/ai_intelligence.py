from typing import List, Any, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.ai_insights import StudentAIAnalysis, DailyStudyTip
from app.models.user import User, UserRole
from app.schemas.ai import (
    StudentAIAnalysisOut, ClassAIOverviewOut, DailyStudyTipOut
)
from app.services.ai_service import ai_service
from app.api.deps import get_current_user, get_current_teacher, get_current_admin

router = APIRouter()

@router.get("/student/{student_id}", response_model=StudentAIAnalysisOut)
async def get_student_ai_analysis(
    student_id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Runs the full AI Academic Intelligence engine pipeline on demand or retrieves latest cached analysis.
    """
    analysis = await ai_service.analyze_student_performance(db, student_id)
    return analysis

@router.get("/class/{class_id}", response_model=ClassAIOverviewOut)
async def get_class_ai_overview(
    class_id: int,
    teacher: User = Depends(get_current_teacher),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Generates class-wide risk distribution and weak-subject clusters for Mentors.
    """
    overview = await ai_service.get_class_ai_overview(db, class_id)
    return overview

@router.get("/study-tips", response_model=List[DailyStudyTipOut])
async def get_daily_study_tips(db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(select(DailyStudyTip).order_by(DailyStudyTip.id))
    tips = result.scalars().all()
    if not tips:
        # Fallback default tips
        tip1 = DailyStudyTip(
            title="Spaced Repetition for System Concepts",
            content="Review Database Normalization rules 24 hours, 3 days, and 7 days after the lecture to achieve 92% retention rate.",
            category="Memory Retention",
            icon="brain",
            active_date=date.today()
        )
        tip2 = DailyStudyTip(
            title="Active Recall with Code Snippets",
            content="Write SQL subqueries on paper before testing in workbench to cement syntactical confidence for internal tests.",
            category="Active Learning",
            icon="code",
            active_date=date.today()
        )
        db.add_all([tip1, tip2])
        await db.commit()
        tips = [tip1, tip2]
    return tips

@router.get("/risk-detection", response_model=List[StudentAIAnalysisOut])
async def get_campus_risk_detection(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Returns all students identified as High or Critical Academic Risk across the institution.
    """
    result = await db.execute(
        select(StudentAIAnalysis).where(StudentAIAnalysis.risk_level.in_(["high", "critical"])).order_by(StudentAIAnalysis.risk_score.desc())
    )
    return result.scalars().all()
