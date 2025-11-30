import base64
from io import BytesIO
from PIL import Image
import json
from app.core.config import settings
from groq import Groq
from openai import AsyncOpenAI

class OCRService:
    def __init__(self):
        groq_key = getattr(settings, 'GROQ_API_KEY', '')
        openai_key = getattr(settings, 'OPENAI_API_KEY', '')
        
        if groq_key and groq_key.strip():
            self.client = Groq(api_key=groq_key)
            self.model = "llama-3.3-70b-versatile"
            self.provider = "groq"
        elif openai_key and openai_key.strip():
            self.client = AsyncOpenAI(api_key=openai_key)
            self.model = "gpt-4"
            self.provider = "openai"
        else:
            self.client = None
    
    async def extract_text_from_image(self, image_base64: str) -> str:
        try:
            image_data = base64.b64decode(image_base64)
            image = Image.open(BytesIO(image_data))
            
            try:
                import pytesseract
                pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
                text = pytesseract.image_to_string(image, lang='por')
                return text.strip()
            except Exception as e:
                return f"Erro ao processar imagem com Tesseract: {str(e)}. Instale: https://github.com/UB-Mannheim/tesseract/wiki"
        
        except Exception as e:
            return f"Erro ao processar imagem: {str(e)}"
    
    async def analyze_exercise_from_text(self, text: str) -> dict:
        if not self.client:
            return {
                "title": "Exercício da foto",
                "question": text,
                "subject": "matematica",
                "difficulty": "medio",
                "type": "multipla_escolha"
            }
        
        prompt = f"""Analise o seguinte texto extraído de uma foto/exercício:

{text}

Identifique:
1. A pergunta principal
2. As opções de resposta (se houver)
3. A matéria (matemática, português, ciências, etc)
4. O nível de dificuldade

Retorne um JSON com:
{{
  "title": "título curto",
  "question": "pergunta completa",
  "subject": "matematica|portugues|ciencias|historia|geografia|fisica|quimica|biologia|ingles",
  "difficulty": "facil|medio|dificil|desafio",
  "type": "multipla_escolha|verdadeiro_falso|dissertativa|completar",
  "options": {{"a": "opção 1", "b": "opção 2", "c": "opção 3", "d": "opção 4"}},
  "suggested_answer": "resposta sugerida ou letra correta",
  "explanation": "explicação da resposta"
}}

Se não conseguir identificar algo, use valores padrão razoáveis.
Retorne APENAS o JSON."""

        try:
            if self.provider == "groq":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Você é um especialista em analisar exercícios educacionais. Retorne apenas JSON válido."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=1000
                )
            else:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Você é um especialista em analisar exercícios educacionais. Retorne apenas JSON válido."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=1000
                )
            
            content = response.choices[0].message.content.strip()
            
            if content.startswith('```json'):
                content = content.split('```json')[1].split('```')[0].strip()
            elif content.startswith('```'):
                content = content.split('```')[1].split('```')[0].strip()
            
            exercise_data = json.loads(content)
            return exercise_data
            
        except Exception as e:
            print(f"Erro ao analisar texto com IA: {e}")
            return {
                "title": "Exercício da foto",
                "question": text,
                "subject": "matematica",
                "difficulty": "medio",
                "type": "dissertativa"
            }



