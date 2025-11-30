from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_profile(db: Session = Depends(get_db)):
    user_id = 1
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return user

@router.put("/me", response_model=UserResponse)
async def update_profile(user_data: UserUpdate, db: Session = Depends(get_db)):
    user_id = 1
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if user_data.name is not None:
        user.name = user_data.name
    if user_data.grade is not None:
        user.grade = user_data.grade
    if user_data.avatar is not None:
        user.avatar = user_data.avatar
    if user_data.bio is not None:
        user.bio = user_data.bio
    
    db.commit()
    db.refresh(user)
    
    return user

@router.get("/grades")
async def get_available_grades():
    return {
        "grades": [
            {"value": "1ano-fundamental", "label": "1º Ano - Fundamental", "category": "Fundamental 1"},
            {"value": "2ano-fundamental", "label": "2º Ano - Fundamental", "category": "Fundamental 1"},
            {"value": "3ano-fundamental", "label": "3º Ano - Fundamental", "category": "Fundamental 1"},
            {"value": "4ano-fundamental", "label": "4º Ano - Fundamental", "category": "Fundamental 1"},
            {"value": "5ano-fundamental", "label": "5º Ano - Fundamental", "category": "Fundamental 1"},
            {"value": "6ano-fundamental", "label": "6º Ano - Fundamental", "category": "Fundamental 2"},
            {"value": "7ano-fundamental", "label": "7º Ano - Fundamental", "category": "Fundamental 2"},
            {"value": "8ano-fundamental", "label": "8º Ano - Fundamental", "category": "Fundamental 2"},
            {"value": "9ano-fundamental", "label": "9º Ano - Fundamental", "category": "Fundamental 2"},
            {"value": "1ano-medio", "label": "1º Ano - Ensino Médio", "category": "Ensino Médio"},
            {"value": "2ano-medio", "label": "2º Ano - Ensino Médio", "category": "Ensino Médio"},
            {"value": "3ano-medio", "label": "3º Ano - Ensino Médio", "category": "Ensino Médio"},
            {"value": "pre-vestibular", "label": "Pré-Vestibular", "category": "Pré-Vestibular"},
        ]
    }



