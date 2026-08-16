from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.academic import Course
from app.models.user import User
from app.schemas.academic import CourseCreate, CourseOut
from app.api.deps import get_current_admin, get_current_user

router = APIRouter()

@router.get("/", response_model=List[CourseOut])
async def list_courses(
    search: Optional[str] = Query(None, description="Search term for title/code/category"),
    category: Optional[str] = Query(None, description="Filter by category"),
    featured_only: bool = False,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Course)
    if featured_only:
        stmt = stmt.where(Course.is_featured == True)
    if category and category != "All":
        stmt = stmt.where(Course.category == category)
    if search:
        search_pattern = f"%{search}%"
        stmt = stmt.where(
            or_(
                Course.title.ilike(search_pattern),
                Course.code.ilike(search_pattern),
                Course.description.ilike(search_pattern)
            )
        )
    stmt = stmt.order_by(Course.rating.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{course_id}", response_model=CourseOut)
async def get_course(course_id: int, db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/", response_model=CourseOut)
async def create_course(
    course_in: CourseCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
) -> Any:
    course = Course(**course_in.model_dump())
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course

@router.post("/{course_id}/enroll")
async def enroll_in_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    return {
        "success": True,
        "message": f"Successfully enrolled in {course.title} ({course.code})",
        "course_id": course.id,
        "student_id": current_user.id
    }
