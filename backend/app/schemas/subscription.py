from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.subscription import PlanType

class PlanResponse(BaseModel):
    id: int
    name: str
    type: PlanType
    price_monthly: float
    price_yearly: float
    
    max_exercises_per_day: int
    max_ai_questions_per_day: int
    ai_exercise_generation: bool
    custom_reports: bool
    priority_support: bool
    ad_free: bool
    
    description: Optional[str] = None
    features: Optional[str] = None
    
    class Config:
        from_attributes = True

class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    plan: PlanResponse
    status: str
    start_date: datetime
    end_date: Optional[datetime] = None
    is_trial: bool
    auto_renew: bool
    
    class Config:
        from_attributes = True

class SubscriptionCreate(BaseModel):
    plan_id: int
    payment_method: Optional[str] = None

class UsageResponse(BaseModel):
    exercises_today: int
    ai_questions_today: int
    exercises_remaining: int
    ai_questions_remaining: int
    plan_name: str




