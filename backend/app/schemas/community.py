from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.exercise import Subject, Difficulty, ExerciseType

class CommunityExerciseCreate(BaseModel):
    title: str
    question: str
    subject: Subject
    difficulty: Difficulty
    type: ExerciseType
    options: Optional[str] = None
    correct_answer: str
    explanation: Optional[str] = None
    source: Optional[str] = None

class CommunityExerciseResponse(BaseModel):
    id: int
    created_by: int
    title: str
    question: str
    subject: Subject
    difficulty: Difficulty
    type: ExerciseType
    is_approved: bool
    is_public: bool
    upvotes: int
    times_used: int
    created_at: datetime
    creator_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class OCRRequest(BaseModel):
    image_base64: str
    
class OCRResponse(BaseModel):
    success: bool
    extracted_text: str
    suggested_exercise: Optional[dict] = None



