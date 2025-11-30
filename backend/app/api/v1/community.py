from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.permissions import check_admin
from app.middleware.exercise_limits import check_private_exercise_limit, check_ocr_access
from app.models.community_exercise import CommunityExercise, ExerciseOCR
from app.models.user import User
from app.schemas.community import (
    CommunityExerciseCreate, CommunityExerciseResponse, OCRRequest, OCRResponse
)
from app.services.ocr_service import OCRService
import base64

router = APIRouter()

@router.post("/exercises", response_model=CommunityExerciseResponse)
async def create_community_exercise(
    exercise: CommunityExerciseCreate,
    is_private: bool = True,
    db: Session = Depends(get_db)
):
    """
    Cria um exercício.
    
    - is_private=True (padrão): Exercício privado, só o criador vê. Auto-aprovado.
    - is_private=False: Exercício público, vai para moderação.
    """
    user_id = 1
    
    if is_private:
        check_private_exercise_limit(user_id, db)
        is_approved = True
        is_public_flag = False
    else:
        is_approved = False
        is_public_flag = False
    
    new_exercise = CommunityExercise(
        created_by=user_id,
        title=exercise.title,
        question=exercise.question,
        subject=exercise.subject,
        difficulty=exercise.difficulty,
        type=exercise.type,
        options=exercise.options,
        correct_answer=exercise.correct_answer,
        explanation=exercise.explanation,
        source=exercise.source or "user_created",
        is_private=is_private,
        is_public=is_public_flag,
        is_approved=is_approved
    )
    
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    
    creator = db.query(User).filter(User.id == user_id).first()
    response_data = CommunityExerciseResponse.model_validate(new_exercise)
    if creator:
        response_data.creator_name = creator.name
    
    return response_data

@router.get("/exercises", response_model=List[CommunityExerciseResponse])
async def list_community_exercises(
    approved_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(CommunityExercise)
    
    if approved_only:
        query = query.filter(CommunityExercise.is_approved == True)
    
    exercises = query.order_by(CommunityExercise.created_at.desc()).limit(50).all()
    
    result = []
    for ex in exercises:
        creator = db.query(User).filter(User.id == ex.created_by).first()
        ex_response = CommunityExerciseResponse.model_validate(ex)
        if creator:
            ex_response.creator_name = creator.name
        result.append(ex_response)
    
    return result

@router.get("/my-exercises", response_model=List[CommunityExerciseResponse])
async def get_my_exercises(
    only_private: bool = True,
    db: Session = Depends(get_db)
):
    """
    Lista os exercícios do usuário.
    
    - only_private=True: Apenas exercícios privados (padrão)
    - only_private=False: Todos os exercícios (privados + públicos)
    """
    user_id = 1
    
    query = db.query(CommunityExercise).filter(
        CommunityExercise.created_by == user_id
    )
    
    if only_private:
        query = query.filter(CommunityExercise.is_private == True)
    
    exercises = query.order_by(CommunityExercise.created_at.desc()).all()
    
    creator = db.query(User).filter(User.id == user_id).first()
    
    result = []
    for ex in exercises:
        ex_response = CommunityExerciseResponse.model_validate(ex)
        if creator:
            ex_response.creator_name = creator.name
        result.append(ex_response)
    
    return result

@router.post("/ocr", response_model=OCRResponse)
async def process_image_ocr(request: OCRRequest, db: Session = Depends(get_db)):
    user_id = 1
    
    check_ocr_access(user_id, db)
    
    ocr_service = OCRService()
    
    try:
        extracted_text = await ocr_service.extract_text_from_image(request.image_base64)
        
        if not extracted_text or "Erro" in extracted_text:
            return OCRResponse(
                success=False,
                extracted_text=extracted_text,
                suggested_exercise=None
            )
        
        suggested = await ocr_service.analyze_exercise_from_text(extracted_text)
        
        ocr_record = ExerciseOCR(
            user_id=user_id,
            image_url="base64_image",
            extracted_text=extracted_text,
            processed=True,
            processed_at=datetime.utcnow()
        )
        db.add(ocr_record)
        db.commit()
        
        return OCRResponse(
            success=True,
            extracted_text=extracted_text,
            suggested_exercise=suggested
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")

@router.post("/exercises/{exercise_id}/approve")
async def approve_exercise(exercise_id: int, db: Session = Depends(get_db)):
    user_id = 1
    
    check_admin(user_id, db)
    
    exercise = db.query(CommunityExercise).filter(CommunityExercise.id == exercise_id).first()
    
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    
    exercise.is_approved = True
    exercise.is_public = True
    exercise.approved_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Exercício aprovado e publicado!"}

@router.post("/exercises/{exercise_id}/vote")
async def vote_exercise(exercise_id: int, vote_type: str, db: Session = Depends(get_db)):
    exercise = db.query(CommunityExercise).filter(CommunityExercise.id == exercise_id).first()
    
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    
    if vote_type == "up":
        exercise.upvotes += 1
    elif vote_type == "down":
        exercise.downvotes += 1
    
    db.commit()
    
    return {"upvotes": exercise.upvotes, "downvotes": exercise.downvotes}

