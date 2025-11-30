from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.middleware.plan_limits import get_usage_stats
from app.middleware.exercise_limits import get_exercise_limits

router = APIRouter()

@router.get("/stats")
async def get_user_usage(db: Session = Depends(get_db)):
    user_id = 1
    
    stats = get_usage_stats(user_id, db)
    
    return stats

@router.get("/exercise-limits")
async def get_user_exercise_limits(db: Session = Depends(get_db)):
    """
    Retorna os limites de exercícios privados e acesso ao OCR.
    """
    user_id = 1
    
    limits = get_exercise_limits(user_id, db)
    
    return limits

