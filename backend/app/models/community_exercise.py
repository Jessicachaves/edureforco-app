from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.models.exercise import Subject, Difficulty, ExerciseType

class CommunityExercise(Base):
    __tablename__ = "community_exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    subject = Column(Enum(Subject), nullable=False)
    difficulty = Column(Enum(Difficulty), nullable=False)
    type = Column(Enum(ExerciseType), nullable=False)
    
    options = Column(String, nullable=True)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    
    is_private = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    times_used = Column(Integer, default=0)
    
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    
    creator = relationship("User")

class ExerciseOCR(Base):
    __tablename__ = "exercise_ocr"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    image_url = Column(String, nullable=False)
    extracted_text = Column(Text, nullable=True)
    
    processed = Column(Boolean, default=False)
    created_exercise_id = Column(Integer, ForeignKey("community_exercises.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

