from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api import (
    auth, users, courses, classes, subjects,
    assignments, attendance, exams_grades,
    ai_intelligence, reports
)
from app.db.seed_data import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo dataset
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    try:
        await seed_database()
    except Exception as e:
        print(f"Seed note: {e}")
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="BUILDATHON 2026 Education Management Portal with Integrated AI Academic Intelligence",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(courses.router, prefix=f"{settings.API_V1_STR}/courses", tags=["Courses"])
app.include_router(classes.router, prefix=f"{settings.API_V1_STR}/classes", tags=["Classes"])
app.include_router(subjects.router, prefix=f"{settings.API_V1_STR}/subjects", tags=["Subjects & Assessment Config"])
app.include_router(assignments.router, prefix=f"{settings.API_V1_STR}/assignments", tags=["Assignments"])
app.include_router(attendance.router, prefix=f"{settings.API_V1_STR}/attendance", tags=["Attendance"])
app.include_router(exams_grades.router, prefix=f"{settings.API_V1_STR}/exams-grades", tags=["Exams & Marks (25/75/100)"])
app.include_router(ai_intelligence.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Academic Intelligence"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Performance Reports"])

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_engine": "online"
    }
