from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserOut, UserCreate
from app.core.security import get_password_hash
from app.api.deps import get_current_admin, get_current_user

router = APIRouter()

@router.get("/", response_model=List[UserOut])
async def list_users(
    role: Optional[UserRole] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(User)
    if role:
        stmt = stmt.where(User.role == role)
    stmt = stmt.order_by(User.full_name)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/teachers/top", response_model=List[UserOut])
async def list_top_teachers(db: AsyncSession = Depends(get_db)) -> Any:
    stmt = select(User).where(User.role == UserRole.TEACHER).limit(6)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserOut)
async def create_user(
    user_in: UserCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
) -> Any:
    existing = await db.execute(select(User).where(User.email == user_in.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User with this email already exists")
        
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        department=user_in.department,
        phone=user_in.phone,
        avatar_url=user_in.avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed={user_in.email}",
        bio=user_in.bio,
        enrollment_number=user_in.enrollment_number,
        class_id=user_in.class_id,
        specialization=user_in.specialization,
        is_active=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
