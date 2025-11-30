from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.progress import Progress
from app.schemas.progress import ProgressResponse, DashboardStats

router = APIRouter()

@router.get("/", response_model=List[ProgressResponse])
async def get_user_progress(db: Session = Depends(get_db)):
    progress = db.query(Progress).filter(Progress.user_id == 1).all()
    return progress

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard(db: Session = Depends(get_db)):
    user_id = 1
    progress_list = db.query(Progress).filter(Progress.user_id == user_id).all()
    
    total_exercises = sum(p.total_exercises for p in progress_list)
    correct_exercises = sum(p.correct_exercises for p in progress_list)
    accuracy = (correct_exercises / total_exercises * 100) if total_exercises > 0 else 0
    
    return DashboardStats(
        total_xp=500,
        level=3,
        streak_days=7,
        total_exercises=total_exercises,
        accuracy=accuracy,
        subjects_progress=progress_list,
        recent_badges=[],
        ranking_position=42
    )

@router.get("/subject/{subject}", response_model=ProgressResponse)
async def get_subject_progress(subject: str, db: Session = Depends(get_db)):
    progress = db.query(Progress).filter(
        Progress.user_id == 1,
        Progress.subject == subject
    ).first()
    
    if not progress:
        progress = Progress(user_id=1, subject=subject)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    return progress




