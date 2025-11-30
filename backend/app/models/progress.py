from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    
    total_exercises = Column(Integer, default=0)
    correct_exercises = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    
    time_spent_minutes = Column(Integer, default=0)
    last_study = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="progress")

class ExerciseAttempt(Base):
    __tablename__ = "exercise_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    
    user_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_spent_seconds = Column(Integer, default=0)
    hints_used = Column(Integer, default=0)
    
    ai_feedback = Column(Text, nullable=True)
    attempted_at = Column(DateTime, default=datetime.utcnow)
    
    exercise = relationship("Exercise", back_populates="attempts")

class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=False)
    requirement = Column(String, nullable=False)
    xp_bonus = Column(Integer, default=0)

class UserBadge(Base):
    __tablename__ = "user_badges"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")



