from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from dateutil.relativedelta import relativedelta
from app.models.user import User
from app.models.subscription import Plan, Subscription, UsageTracker, PlanType

def check_private_exercise_limit(user_id: int, db: Session) -> bool:
    """
    Verifica se o usuário pode criar mais exercícios privados no mês.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()
    
    plan_type = PlanType.FREE
    if subscription:
        plan = db.query(Plan).filter(Plan.id == subscription.plan_id).first()
        if plan:
            plan_type = plan.type
    
    current_plan = db.query(Plan).filter(Plan.type == plan_type).first()
    if not current_plan:
        raise HTTPException(status_code=500, detail="Plano não encontrado")
    
    usage = db.query(UsageTracker).filter(UsageTracker.user_id == user_id).first()
    
    if not usage:
        usage = UsageTracker(
            user_id=user_id,
            exercises_today=0,
            ai_questions_today=0,
            private_exercises_this_month=0,
            last_reset_date=datetime.utcnow(),
            last_monthly_reset=datetime.utcnow()
        )
        db.add(usage)
        db.commit()
    
    if usage.last_monthly_reset.month != datetime.utcnow().month:
        usage.private_exercises_this_month = 0
        usage.last_monthly_reset = datetime.utcnow()
        db.commit()
    
    max_limit = current_plan.max_private_exercises_per_month
    
    if max_limit == -1:
        return True
    
    if usage.private_exercises_this_month >= max_limit:
        raise HTTPException(
            status_code=403,
            detail=f"Limite mensal de exercícios privados atingido ({max_limit}). Upgrade para Premium para criar ilimitados!"
        )
    
    usage.private_exercises_this_month += 1
    usage.updated_at = datetime.utcnow()
    db.commit()
    
    return True

def check_ocr_access(user_id: int, db: Session) -> bool:
    """
    Verifica se o usuário tem acesso ao OCR (foto).
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()
    
    plan_type = PlanType.FREE
    if subscription:
        plan = db.query(Plan).filter(Plan.id == subscription.plan_id).first()
        if plan:
            plan_type = plan.type
    
    current_plan = db.query(Plan).filter(Plan.type == plan_type).first()
    if not current_plan:
        raise HTTPException(status_code=500, detail="Plano não encontrado")
    
    if not current_plan.ocr_enabled:
        raise HTTPException(
            status_code=403,
            detail="📸 OCR (foto) disponível apenas para planos Premium e Enterprise. Faça upgrade!"
        )
    
    return True

def get_exercise_limits(user_id: int, db: Session) -> dict:
    """
    Retorna os limites e uso atual de exercícios privados.
    """
    usage = db.query(UsageTracker).filter(UsageTracker.user_id == user_id).first()
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()
    
    plan_type = PlanType.FREE
    if subscription:
        plan = db.query(Plan).filter(Plan.id == subscription.plan_id).first()
        if plan:
            plan_type = plan.type
    
    current_plan = db.query(Plan).filter(Plan.type == plan_type).first()
    
    if not usage:
        return {
            "private_exercises_used": 0,
            "private_exercises_limit": current_plan.max_private_exercises_per_month if current_plan else 5,
            "ocr_enabled": current_plan.ocr_enabled if current_plan else False,
            "plan_type": plan_type.value
        }
    
    if usage.last_monthly_reset.month != datetime.utcnow().month:
        usage.private_exercises_this_month = 0
        usage.last_monthly_reset = datetime.utcnow()
        db.commit()
    
    return {
        "private_exercises_used": usage.private_exercises_this_month,
        "private_exercises_limit": current_plan.max_private_exercises_per_month if current_plan else 5,
        "ocr_enabled": current_plan.ocr_enabled if current_plan else False,
        "plan_type": plan_type.value,
        "unlimited": current_plan.max_private_exercises_per_month == -1 if current_plan else False
    }



