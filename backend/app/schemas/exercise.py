from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.models.exercise import Subject, Difficulty, ExerciseType

class ExerciseBase(BaseModel):
    title: str
    question: str
    subject: Subject
    difficulty: Difficulty
    type: ExerciseType
    options: Optional[Dict[str, Any]] = None
    explanation: Optional[str] = None
    hints: Optional[List[str]] = None

class ExerciseCreate(ExerciseBase):
    correct_answer: str
    xp_reward: Optional[int] = 10

class ExerciseResponse(ExerciseBase):
    id: int
    xp_reward: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ExerciseCheck(BaseModel):
    exercise_id: int
    user_answer: str
    time_spent_seconds: Optional[int] = 0

class ExerciseResult(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str
    xp_earned: int
    ai_feedback: Optional[str] = None




