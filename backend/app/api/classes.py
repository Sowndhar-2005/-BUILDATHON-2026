from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.academic import ClassEntity
from app.models.user import User
from app.schemas.academic import ClassCreate, ClassOut
from app.schemas.user import UserOut
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()

@router.get("/", response_model=List[ClassOut])
async def list_classes(db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(select(ClassEntity).order_by(ClassEntity.name))
    return result.scalars().all()

@router.get("/{class_id}", response_model=ClassOut)
async def get_class(class_id: int, db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(select(ClassEntity).where(ClassEntity.id == class_id))
    cls = result.scalar_one_or_none()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    return cls

@router.get("/{class_id}/students", response_model=List[UserOut])
async def get_class_students(class_id: int, db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(
        select(User).where(User.class_id == class_id, User.role == "student").order_by(User.full_name)
    )
    return result.scalars().all()

@router.post("/", response_model=ClassOut)
async def create_class(
    class_in: ClassCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
) -> Any:
    cls = ClassEntity(**class_in.model_dump())
    db.add(cls)
    await db.commit()
    await db.refresh(cls)
    return cls
