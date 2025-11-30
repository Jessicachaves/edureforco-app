from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class PlanType(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

class Plan(Base):
    __tablename__ = "plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(Enum(PlanType), nullable=False, unique=True)
    price_monthly = Column(Float, default=0.0)
    price_yearly = Column(Float, default=0.0)
    
    max_exercises_per_day = Column(Integer, default=10)
    max_ai_questions_per_day = Column(Integer, default=5)
    max_private_exercises_per_month = Column(Integer, default=5)
    ocr_enabled = Column(Boolean, default=False)
    ai_exercise_generation = Column(Boolean, default=False)
    can_share_exercises = Column(Boolean, default=False)
    custom_reports = Column(Boolean, default=False)
    priority_support = Column(Boolean, default=False)
    ad_free = Column(Boolean, default=False)
    
    description = Column(String)
    features = Column(String)
    
    subscriptions = relationship("Subscription", back_populates="plan")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    
    status = Column(String, default="active")
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    
    is_trial = Column(Boolean, default=False)
    auto_renew = Column(Boolean, default=True)
    
    payment_method = Column(String, nullable=True)
    last_payment_date = Column(DateTime, nullable=True)
    next_payment_date = Column(DateTime, nullable=True)
    
    plan = relationship("Plan", back_populates="subscriptions")

class UsageTracker(Base):
    __tablename__ = "usage_tracker"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    exercises_today = Column(Integer, default=0)
    ai_questions_today = Column(Integer, default=0)
    private_exercises_this_month = Column(Integer, default=0)
    
    last_reset_date = Column(DateTime, default=datetime.utcnow)
    last_monthly_reset = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

