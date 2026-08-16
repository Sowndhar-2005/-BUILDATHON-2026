from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.assessment import Exam, StudentMark
from app.models.academic import Subject, SubjectAssessmentConfig
from app.models.user import User
from app.schemas.assessment import (
    ExamCreate, ExamOut, StudentMarkEntry, StudentMarkOut
)
from app.services.calculation_service import calculation_service
from app.api.deps import get_current_user, get_current_teacher, get_current_admin

router = APIRouter()

# Exams Management
@router.get("/exams", response_model=List[ExamOut])
async def list_exams(
    subject_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Exam)
    if subject_id:
        stmt = stmt.where(Exam.subject_id == subject_id)
    stmt = stmt.order_by(Exam.exam_date.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/exams", response_model=ExamOut)
async def create_exam(
    exam_in: ExamCreate,
    teacher: User = Depends(get_current_teacher),
    db: AsyncSession = Depends(get_db)
) -> Any:
    exam = Exam(**exam_in.model_dump())
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return exam

# Marks Entry and Calculation
@router.post("/marks", response_model=StudentMarkOut)
async def enter_or_update_student_marks(
    mark_in: StudentMarkEntry,
    teacher: User = Depends(get_current_teacher),
    db: AsyncSession = Depends(get_db)
) -> Any:
    # 1. Fetch Subject Assessment Configuration
    cfg_q = await db.execute(
        select(SubjectAssessmentConfig).where(SubjectAssessmentConfig.subject_id == mark_in.subject_id)
    )
    config = cfg_q.scalar_one_or_none()
    if not config:
        config = SubjectAssessmentConfig(
            subject_id=mark_in.subject_id,
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
        db.add(config)
        await db.commit()
        await db.refresh(config)
        
    # 2. Compute Internal Assessment (/25)
    scores_dict = {
        "internal_test_score": mark_in.internal_test_score or 0.0,
        "model_exam_score": mark_in.model_exam_score or 0.0,
        "assignment_score": mark_in.assignment_score or 0.0,
        "seminar_score": mark_in.seminar_score or 0.0,
        "project_score": mark_in.project_score or 0.0,
    }
    internal_25 = calculation_service.calculate_internal_mark(scores_dict, config)
    
    # 3. Compute Converted External Mark (/75)
    external_raw = mark_in.external_raw_100 or 0.0
    external_conv_75 = calculation_service.calculate_external_converted(external_raw)
    
    # 4. Compute Final Subject Mark (/100) and Grades
    final_100, letter_grade, gp, passed = calculation_service.calculate_final_mark(internal_25, external_conv_75)
    
    # 5. Check if record exists
    existing_q = await db.execute(
        select(StudentMark).where(
            StudentMark.student_id == mark_in.student_id,
            StudentMark.subject_id == mark_in.subject_id
        )
    )
    record = existing_q.scalar_one_or_none()
    
    if not record:
        record = StudentMark(
            student_id=mark_in.student_id,
            subject_id=mark_in.subject_id,
            semester=mark_in.semester,
            internal_test_score=mark_in.internal_test_score,
            model_exam_score=mark_in.model_exam_score,
            assignment_score=mark_in.assignment_score,
            seminar_score=mark_in.seminar_score,
            project_score=mark_in.project_score,
            internal_total_25=internal_25,
            external_raw_100=external_raw,
            external_converted_75=external_conv_75,
            final_mark_100=final_100,
            letter_grade=letter_grade,
            grade_points=gp,
            is_passed=passed,
            remarks=mark_in.remarks
        )
        db.add(record)
    else:
        record.semester = mark_in.semester
        record.internal_test_score = mark_in.internal_test_score
        record.model_exam_score = mark_in.model_exam_score
        record.assignment_score = mark_in.assignment_score
        record.seminar_score = mark_in.seminar_score
        record.project_score = mark_in.project_score
        record.internal_total_25 = internal_25
        record.external_raw_100 = external_raw
        record.external_converted_75 = external_conv_75
        record.final_mark_100 = final_100
        record.letter_grade = letter_grade
        record.grade_points = gp
        record.is_passed = passed
        record.remarks = mark_in.remarks
        
    await db.commit()
    await db.refresh(record)
    return record

@router.get("/student/{student_id}", response_model=List[StudentMarkOut])
async def get_student_marks(
    student_id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(StudentMark).where(StudentMark.student_id == student_id))
    return result.scalars().all()

@router.get("/subject/{subject_id}", response_model=List[StudentMarkOut])
async def get_subject_marks(
    subject_id: int,
    teacher: User = Depends(get_current_teacher),
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(StudentMark).where(StudentMark.subject_id == subject_id))
    return result.scalars().all()
