from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.exercise import Exercise
from app.schemas.exercise import ExerciseCreate, ExerciseResponse
from typing import List

router = APIRouter()

@router.post("/exercises", response_model=ExerciseResponse)
async def create_exercise(exercise: ExerciseCreate, db: Session = Depends(get_db)):
    new_exercise = Exercise(
        title=exercise.title,
        question=exercise.question,
        subject=exercise.subject,
        difficulty=exercise.difficulty,
        type=exercise.type,
        options=exercise.options,
        correct_answer=exercise.correct_answer,
        explanation=exercise.explanation,
        xp_reward=exercise.xp_reward,
        hints=exercise.hints
    )
    
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    
    return new_exercise

@router.delete("/exercises/{exercise_id}")
async def delete_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    
    db.delete(exercise)
    db.commit()
    
    return {"message": "Exercício deletado com sucesso"}

@router.put("/exercises/{exercise_id}", response_model=ExerciseResponse)
async def update_exercise(
    exercise_id: int, 
    exercise_data: ExerciseCreate, 
    db: Session = Depends(get_db)
):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    
    exercise.title = exercise_data.title
    exercise.question = exercise_data.question
    exercise.subject = exercise_data.subject
    exercise.difficulty = exercise_data.difficulty
    exercise.type = exercise_data.type
    exercise.options = exercise_data.options
    exercise.correct_answer = exercise_data.correct_answer
    exercise.explanation = exercise_data.explanation
    exercise.xp_reward = exercise_data.xp_reward
    exercise.hints = exercise_data.hints
    
    db.commit()
    db.refresh(exercise)
    
    return exercise




