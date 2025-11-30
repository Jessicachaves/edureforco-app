from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.user import User
from app.models.subscription import Plan, Subscription, UsageTracker, PlanType

def check_exercise_limit(user_id: int, db: Session) -> bool:
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
    
    free_plan = db.query(Plan).filter(Plan.type == PlanType.FREE).first()
    if not free_plan:
        return True
    
    current_plan = db.query(Plan).filter(Plan.type == plan_type).first()
    if not current_plan:
        return True
    
    usage = db.query(UsageTracker).filter(UsageTracker.user_id == user_id).first()
    
    if not usage:
        usage = UsageTracker(
            user_id=user_id,
            exercises_today=0,
            ai_questions_today=0,
            last_reset_date=datetime.utcnow()
        )
        db.add(usage)
        db.commit()
    
    if usage.last_reset_date.date() < datetime.utcnow().date():
        usage.exercises_today = 0
        usage.ai_questions_today = 0
        usage.last_reset_date = datetime.utcnow()
        db.commit()
    
    if usage.exercises_today >= current_plan.max_exercises_per_day:
        raise HTTPException(
            status_code=403,
            detail=f"Limite diário de exercícios atingido ({current_plan.max_exercises_per_day}). Upgrade para continuar!"
        )
    
    usage.exercises_today += 1
    usage.updated_at = datetime.utcnow()
    db.commit()
    
    return True

def check_ai_limit(user_id: int, db: Session) -> bool:
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
        return True
    
    usage = db.query(UsageTracker).filter(UsageTracker.user_id == user_id).first()
    
    if not usage:
        usage = UsageTracker(
            user_id=user_id,
            exercises_today=0,
            ai_questions_today=0,
            last_reset_date=datetime.utcnow()
        )
        db.add(usage)
        db.commit()
    
    if usage.last_reset_date.date() < datetime.utcnow().date():
        usage.exercises_today = 0
        usage.ai_questions_today = 0
        usage.last_reset_date = datetime.utcnow()
        db.commit()
    
    if usage.ai_questions_today >= current_plan.max_ai_questions_per_day:
        raise HTTPException(
            status_code=403,
            detail=f"Limite diário de perguntas IA atingido ({current_plan.max_ai_questions_per_day}). Upgrade para continuar!"
        )
    
    usage.ai_questions_today += 1
    usage.updated_at = datetime.utcnow()
    db.commit()
    
    return True

def get_usage_stats(user_id: int, db: Session) -> dict:
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
            "exercises_used": 0,
            "exercises_limit": current_plan.max_exercises_per_day if current_plan else 10,
            "ai_questions_used": 0,
            "ai_questions_limit": current_plan.max_ai_questions_per_day if current_plan else 5,
            "plan_type": plan_type.value
        }
    
    if usage.last_reset_date.date() < datetime.utcnow().date():
        usage.exercises_today = 0
        usage.ai_questions_today = 0
        usage.last_reset_date = datetime.utcnow()
        db.commit()
    
    return {
        "exercises_used": usage.exercises_today,
        "exercises_limit": current_plan.max_exercises_per_day if current_plan else 10,
        "ai_questions_used": usage.ai_questions_today,
        "ai_questions_limit": current_plan.max_ai_questions_per_day if current_plan else 5,
        "plan_type": plan_type.value
    }



