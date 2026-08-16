from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.academic import Subject, SubjectAssessmentConfig
from app.models.user import User
from app.schemas.academic import (
    SubjectCreate, SubjectOut, AssessmentConfigCreate, AssessmentConfigOut
)
from app.api.deps import get_current_user, get_current_teacher, get_current_admin

router = APIRouter()

@router.get("/", response_model=List[SubjectOut])
async def list_subjects(
    class_id: Optional[int] = None,
    teacher_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Subject)
    if class_id:
        stmt = stmt.where(Subject.class_id == class_id)
    if teacher_id:
        stmt = stmt.where(Subject.teacher_id == teacher_id)
    stmt = stmt.order_by(Subject.name)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{subject_id}", response_model=SubjectOut)
async def get_subject(subject_id: int, db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(select(Subject).where(Subject.id == subject_id))
    subj = result.scalar_one_or_none()
    if not subj:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subj

@router.post("/", response_model=SubjectOut)
async def create_subject(
    subject_in: SubjectCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
) -> Any:
    subj = Subject(**subject_in.model_dump())
    db.add(subj)
    await db.commit()
    await db.refresh(subj)
    
    # Auto-generate default assessment config (/25)
    cfg = SubjectAssessmentConfig(
        subject_id=subj.id,
        has_internal_test=True,
        internal_test_max=10.0,
        has_model_exam=True,
        model_exam_max=5.0,
        has_assignment=True,
        assignment_max=5.0,
        has_seminar=True,
        seminar_max=2.5,
        has_project=True,
        project_max=2.5,
        total_internal_target=25.0
    )
    db.add(cfg)
    await db.commit()
    return subj

# Subject Assessment Config endpoints
@router.get("/{subject_id}/assessment-config", response_model=AssessmentConfigOut)
async def get_assessment_config(subject_id: int, db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(select(SubjectAssessmentConfig).where(SubjectAssessmentConfig.subject_id == subject_id))
    cfg = result.scalar_one_or_none()
    if not cfg:
        # Create default config if missing
        cfg = SubjectAssessmentConfig(
            subject_id=subject_id,
            has_internal_test=True,
            internal_test_max=10.0,
            has_model_exam=True,
            model_exam_max=5.0,
            has_assignment=True,
            assignment_max=5.0,
            has_seminar=True,
            seminar_max=2.5,
            has_project=True,
            project_max=2.5,
            total_internal_target=25.0
        )
        db.add(cfg)
        await db.commit()
        await db.refresh(cfg)
    return cfg

@router.put("/{subject_id}/assessment-config", response_model=AssessmentConfigOut)
async def update_assessment_config(
    subject_id: int,
    config_in: AssessmentConfigCreate,
    teacher: User = Depends(get_current_teacher),
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(SubjectAssessmentConfig).where(SubjectAssessmentConfig.subject_id == subject_id))
    cfg = result.scalar_one_or_none()
    
    if not cfg:
        cfg = SubjectAssessmentConfig(**config_in.model_dump())
        db.add(cfg)
    else:
        for k, v in config_in.model_dump().items():
            setattr(cfg, k, v)
            
    await db.commit()
    await db.refresh(cfg)
    return cfg
