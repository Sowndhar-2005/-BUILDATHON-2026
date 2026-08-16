from typing import List, Any, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.attendance import AttendanceRecord
from app.models.academic import Subject, ClassEntity
from app.models.user import User
from app.schemas.attendance import (
    AttendanceRecordCreate, AttendanceBatchCreate, AttendanceRecordOut, AttendanceSummary
)
from app.api.deps import get_current_user, get_current_teacher

router = APIRouter()

@router.post("/batch", response_model=List[AttendanceRecordOut])
async def record_batch_attendance(
    batch_in: AttendanceBatchCreate,
    teacher: User = Depends(get_current_teacher),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Class Mentor or Subject Teacher records roll call for entire class for a specific date.
    """
    saved_records = []
    for item in batch_in.records:
        # Check if record exists for student, subject, and date
        existing = await db.execute(
            select(AttendanceRecord).where(
                AttendanceRecord.student_id == item.student_id,
                AttendanceRecord.subject_id == batch_in.subject_id,
                AttendanceRecord.date == batch_in.date
            )
        )
        rec = existing.scalar_one_or_none()
        if not rec:
            rec = AttendanceRecord(
                student_id=item.student_id,
                subject_id=batch_in.subject_id,
                class_id=batch_in.class_id,
                recorded_by=teacher.id,
                date=batch_in.date,
                status=item.status,
                remarks=item.remarks
            )
            db.add(rec)
        else:
            rec.status = item.status
            rec.remarks = item.remarks
            rec.recorded_by = teacher.id
            
        saved_records.append(rec)
        
    await db.commit()
    for r in saved_records:
        await db.refresh(r)
    return saved_records

@router.get("/student/{student_id}", response_model=List[AttendanceRecordOut])
async def get_student_attendance(
    student_id: int,
    subject_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(AttendanceRecord).where(AttendanceRecord.student_id == student_id)
    if subject_id:
        stmt = stmt.where(AttendanceRecord.subject_id == subject_id)
    stmt = stmt.order_by(AttendanceRecord.date.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/student/{student_id}/summary", response_model=AttendanceSummary)
async def get_student_attendance_summary(
    student_id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    tot_q = await db.execute(select(func.count(AttendanceRecord.id)).where(AttendanceRecord.student_id == student_id))
    total = tot_q.scalar() or 0
    
    pres_q = await db.execute(
        select(func.count(AttendanceRecord.id)).where(
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.status == "present"
        )
    )
    present = pres_q.scalar() or 0
    absent = total - present
    
    pct = round((present / total * 100), 1) if total > 0 else 100.0
    return AttendanceSummary(
        student_id=student_id,
        total_classes=total,
        present_classes=present,
        absent_classes=absent,
        attendance_percentage=pct,
        is_at_risk=pct < 75.0
    )
