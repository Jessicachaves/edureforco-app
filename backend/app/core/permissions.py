from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserRole

def check_admin(user_id: int, db: Session) -> bool:
    """Verifica se o usuário é admin ou moderador"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if user.role not in [UserRole.ADMIN, UserRole.TEACHER]:
        raise HTTPException(
            status_code=403, 
            detail="Acesso negado. Apenas administradores e professores podem acessar esta funcionalidade."
        )
    
    return True

def is_admin_or_teacher(user_id: int, db: Session) -> bool:
    """Verifica se o usuário tem permissão de moderação (sem lançar exceção)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return False
    
    return user.role in [UserRole.ADMIN, UserRole.TEACHER]

def get_user_role(user_id: int, db: Session) -> str:
    """Retorna o role do usuário"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return "student"
    
    return user.role.value



