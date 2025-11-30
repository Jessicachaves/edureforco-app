from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.progress import Badge, UserBadge
from app.schemas.progress import BadgeResponse

router = APIRouter()

@router.get("/badges", response_model=List[BadgeResponse])
async def get_available_badges(db: Session = Depends(get_db)):
    badges = db.query(Badge).all()
    return badges

@router.get("/my-badges", response_model=List[BadgeResponse])
async def get_user_badges(db: Session = Depends(get_db)):
    user_id = 1
    user_badges = db.query(UserBadge).filter(UserBadge.user_id == user_id).all()
    
    badges_list = []
    for ub in user_badges:
        badge = db.query(Badge).filter(Badge.id == ub.badge_id).first()
        if badge:
            badge_response = BadgeResponse(
                id=badge.id,
                name=badge.name,
                description=badge.description,
                icon=badge.icon,
                earned_at=ub.earned_at
            )
            badges_list.append(badge_response)
    
    return badges_list

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.xp.desc()).limit(limit).all()
    
    leaderboard = []
    for idx, user in enumerate(users, 1):
        leaderboard.append({
            "position": idx,
            "name": user.name,
            "level": user.level,
            "xp": user.xp,
            "streak_days": user.streak_days
        })
    
    return leaderboard

@router.post("/add-xp/{amount}")
async def add_xp(amount: int, db: Session = Depends(get_db)):
    user_id = 1
    user = db.query(User).filter(User.id == user_id).first()
    
    if user:
        user.xp += amount
        
        xp_for_next_level = user.level * 100
        if user.xp >= xp_for_next_level:
            user.level += 1
            user.xp = user.xp - xp_for_next_level
        
        db.commit()
        db.refresh(user)
        
        return {
            "new_xp": user.xp,
            "new_level": user.level,
            "leveled_up": True
        }
    
    return {"error": "Usuário não encontrado"}




