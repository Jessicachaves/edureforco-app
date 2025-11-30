from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.subscription import Plan, Subscription, UsageTracker, PlanType
from app.schemas.subscription import (
    PlanResponse, SubscriptionResponse, SubscriptionCreate, UsageResponse
)
from typing import List

router = APIRouter()

@router.get("/plans", response_model=List[PlanResponse])
async def get_plans(db: Session = Depends(get_db)):
    plans = db.query(Plan).all()
    return plans

@router.get("/my-subscription", response_model=SubscriptionResponse)
async def get_my_subscription(db: Session = Depends(get_db)):
    user_id = 1
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()
    
    if not subscription:
        free_plan = db.query(Plan).filter(Plan.type == PlanType.FREE).first()
        if free_plan:
            subscription = Subscription(
                user_id=user_id,
                plan_id=free_plan.id,
                status="active"
            )
            db.add(subscription)
            db.commit()
            db.refresh(subscription)
    
    return subscription

@router.post("/subscribe", response_model=SubscriptionResponse)
async def subscribe(
    subscription_data: SubscriptionCreate,
    db: Session = Depends(get_db)
):
    user_id = 1
    
    existing = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()
    
    if existing:
        existing.status = "cancelled"
        db.commit()
    
    plan = db.query(Plan).filter(Plan.id == subscription_data.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plano não encontrado")
    
    new_subscription = Subscription(
        user_id=user_id,
        plan_id=plan.id,
        status="active",
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30),
        payment_method=subscription_data.payment_method,
        next_payment_date=datetime.utcnow() + timedelta(days=30)
    )
    
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return new_subscription

@router.get("/usage", response_model=UsageResponse)
async def get_usage(db: Session = Depends(get_db)):
    user_id = 1
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Assinatura não encontrada")
    
    usage = db.query(UsageTracker).filter(UsageTracker.user_id == user_id).first()
    
    if not usage:
        usage = UsageTracker(user_id=user_id)
        db.add(usage)
        db.commit()
        db.refresh(usage)
    
    if usage.last_reset_date.date() < datetime.utcnow().date():
        usage.exercises_today = 0
        usage.ai_questions_today = 0
        usage.last_reset_date = datetime.utcnow()
        db.commit()
    
    plan = subscription.plan
    
    return UsageResponse(
        exercises_today=usage.exercises_today,
        ai_questions_today=usage.ai_questions_today,
        exercises_remaining=max(0, plan.max_exercises_per_day - usage.exercises_today),
        ai_questions_remaining=max(0, plan.max_ai_questions_per_day - usage.ai_questions_today),
        plan_name=plan.name
    )

@router.post("/cancel")
async def cancel_subscription(db: Session = Depends(get_db)):
    user_id = 1
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Assinatura não encontrada")
    
    subscription.status = "cancelled"
    subscription.auto_renew = False
    db.commit()
    
    return {"message": "Assinatura cancelada com sucesso"}




