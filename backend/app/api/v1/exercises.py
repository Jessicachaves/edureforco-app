from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.exercise import Exercise, Subject, Difficulty
from app.models.progress import ExerciseAttempt
from app.schemas.exercise import ExerciseResponse, ExerciseCheck, ExerciseResult
from app.services.ai_service import AIService

router = APIRouter()

@router.get("/", response_model=List[ExerciseResponse])
async def list_exercises(
    subject: Subject = Query(None),
    difficulty: Difficulty = Query(None),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Exercise)
    
    if subject:
        query = query.filter(Exercise.subject == subject)
    if difficulty:
        query = query.filter(Exercise.difficulty == difficulty)
    
    exercises = query.limit(limit).all()
    return exercises

@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    return exercise

@router.get("/adaptive/{subject}")
async def get_adaptive_exercise(
    subject: str,
    db: Session = Depends(get_db)
):
    exercises = db.query(Exercise).filter(
        Exercise.subject == subject
    ).limit(5).all()
    
    if not exercises:
        raise HTTPException(status_code=404, detail="Nenhum exercício encontrado")
    
    return exercises[0]

@router.post("/check", response_model=ExerciseResult)
async def check_exercise(
    check_data: ExerciseCheck,
    db: Session = Depends(get_db)
):
    exercise = db.query(Exercise).filter(Exercise.id == check_data.exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    
    is_correct = check_data.user_answer.strip().lower() == exercise.correct_answer.strip().lower()
    
    ai_feedback = None
    if not is_correct and exercise.type.value == "dissertativa":
        ai_service = AIService()
        ai_feedback = await ai_service.generate_feedback(
            question=exercise.question,
            user_answer=check_data.user_answer,
            correct_answer=exercise.correct_answer
        )
    
    xp_earned = exercise.xp_reward if is_correct else int(exercise.xp_reward * 0.3)
    
    return ExerciseResult(
        is_correct=is_correct,
        correct_answer=exercise.correct_answer,
        explanation=exercise.explanation or "Explicação não disponível",
        xp_earned=xp_earned,
        ai_feedback=ai_feedback
    )



