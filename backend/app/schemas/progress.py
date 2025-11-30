from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ProgressResponse(BaseModel):
    id: int
    subject: str
    total_exercises: int
    correct_exercises: int
    accuracy: float
    time_spent_minutes: int
    last_study: datetime
    
    class Config:
        from_attributes = True

class BadgeResponse(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    earned_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_xp: int
    level: int
    streak_days: int
    total_exercises: int
    accuracy: float
    subjects_progress: List[ProgressResponse]
    recent_badges: List[BadgeResponse]
    ranking_position: Optional[int] = None

