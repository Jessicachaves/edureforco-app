from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import AIService

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str
    subject: str
    context: str = ""

class ExerciseGenerateRequest(BaseModel):
    subject: str
    difficulty: str
    topic: str
    quantity: int = 1

@router.post("/ask")
async def ask_tutor(request: QuestionRequest):
    ai_service = AIService()
    
    try:
        response = await ai_service.answer_question(
            question=request.question,
            subject=request.subject,
            context=request.context
        )
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/explain")
async def explain_concept(request: QuestionRequest):
    ai_service = AIService()
    
    try:
        explanation = await ai_service.explain_concept(
            concept=request.question,
            subject=request.subject
        )
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-exercise")
async def generate_exercise(request: ExerciseGenerateRequest):
    ai_service = AIService()
    
    if not ai_service.client:
        raise HTTPException(
            status_code=400, 
            detail="IA não configurada. Configure GROQ_API_KEY ou OPENAI_API_KEY no .env"
        )
    
    try:
        exercises = await ai_service.generate_exercise(
            subject=request.subject,
            difficulty=request.difficulty,
            topic=request.topic,
            quantity=request.quantity
        )
        return {
            "success": True,
            "count": len(exercises),
            "exercises": exercises
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar exercícios: {str(e)}")

@router.post("/hint")
async def get_hint(exercise_id: int):
    ai_service = AIService()
    
    hint = await ai_service.generate_hint(exercise_id)
    return {"hint": hint}

