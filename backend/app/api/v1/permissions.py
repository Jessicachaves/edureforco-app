from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.permissions import is_admin_or_teacher, get_user_role

router = APIRouter()

@router.get("/check-admin")
async def check_admin_status(db: Session = Depends(get_db)):
    """Verifica se o usuário logado tem permissões de admin/moderador"""
    user_id = 1
    
    is_admin = is_admin_or_teacher(user_id, db)
    role = get_user_role(user_id, db)
    
    return {
        "is_admin": is_admin,
        "role": role,
        "can_moderate": is_admin
    }




