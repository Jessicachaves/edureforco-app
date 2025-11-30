from openai import AsyncOpenAI
from groq import Groq
from app.core.config import settings
import json

class AIService:
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
            self.model = None
            self.provider = None
    
    async def answer_question(self, question: str, subject: str, context: str = "") -> str:
        if not self.client:
            return "Serviço de IA não configurado. Adicione GROQ_API_KEY ou OPENAI_API_KEY no .env"
        
        prompt = f"""Você é um tutor educacional especializado em {subject}.
        
Contexto: {context if context else 'Não fornecido'}

Pergunta do aluno: {question}

Responda de forma clara, didática e adequada para estudantes do ensino fundamental e médio.
Use exemplos práticos quando possível."""

        if self.provider == "groq":
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Você é um tutor educacional paciente e didático."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
        else:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Você é um tutor educacional paciente e didático."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
        
        return response.choices[0].message.content
    
    async def explain_concept(self, concept: str, subject: str) -> str:
        if not self.client:
            return "Serviço de IA não configurado"
        
        prompt = f"""Explique o conceito de "{concept}" em {subject} de forma simples e didática.

Estruture sua explicação assim:
1. Definição básica
2. Exemplo prático do dia a dia
3. Por que é importante aprender isso
4. Dica para memorizar

Use linguagem simples e amigável."""

        if self.provider == "groq":
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Você é um professor especialista em simplificar conceitos complexos."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=600
            )
        else:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Você é um professor especialista em simplificar conceitos complexos."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=600
            )
        
        return response.choices[0].message.content
    
    async def generate_feedback(self, question: str, user_answer: str, correct_answer: str) -> str:
        if not self.client:
            return "Bom esforço! Continue praticando."
        
        prompt = f"""Questão: {question}

Resposta do aluno: {user_answer}
Resposta correta: {correct_answer}

Forneça um feedback construtivo e encorajador:
- Aponte o que estava certo na resposta
- Explique gentilmente onde errou
- Dê uma dica para melhorar
- Seja positivo e motivador"""

        if self.provider == "groq":
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Você é um tutor encorajador que dá feedback construtivo."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
        else:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Você é um tutor encorajador que dá feedback construtivo."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
        
        return response.choices[0].message.content
    
    async def generate_exercise(self, subject: str, difficulty: str, topic: str, quantity: int = 1) -> list:
        if not self.client:
            return [{
                "title": "Exemplo de exercício",
                "question": "Esta é uma questão de exemplo. Configure a API para gerar exercícios reais.",
                "options": {"a": "Opção A", "b": "Opção B", "c": "Opção C", "d": "Opção D"},
                "correct_answer": "a",
                "explanation": "Explicação exemplo"
            }]
        
        difficulty_map = {
            "facil": "fácil (fundamental 1)",
            "medio": "médio (fundamental 2)",  
            "dificil": "difícil (ensino médio)",
            "desafio": "desafiador (vestibular/ENEM)"
        }
        
        diff_desc = difficulty_map.get(difficulty.lower(), difficulty)
        
        prompt = f"""Gere exatamente {quantity} exercício(s) de múltipla escolha sobre "{topic}" em {subject}.

Nível: {diff_desc}

IMPORTANTE: Retorne apenas um array JSON válido, sem markdown, sem explicações.

Formato esperado:
[
  {{
    "title": "Título curto e direto",
    "question": "Pergunta clara e bem formulada",
    "options": {{
      "a": "Primeira opção",
      "b": "Segunda opção",
      "c": "Terceira opção",
      "d": "Quarta opção"
    }},
    "correct_answer": "a",
    "explanation": "Explicação detalhada da resposta correta"
  }}
]

Requisitos:
- Questões apropriadas para o nível especificado
- Opções plausíveis (não óbvias demais)
- Explicação didática e clara
- Português brasileiro correto
- Apenas JSON, sem texto antes ou depois"""

        try:
            if self.provider == "groq":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Você é um especialista em criar exercícios educacionais. Retorne APENAS JSON válido, sem markdown ou texto adicional."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2000
                )
            else:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Você é um especialista em criar exercícios educacionais. Retorne APENAS JSON válido, sem markdown ou texto adicional."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2000
                )
            
            content = response.choices[0].message.content.strip()
            
            if content.startswith('```json'):
                content = content.split('```json')[1].split('```')[0].strip()
            elif content.startswith('```'):
                content = content.split('```')[1].split('```')[0].strip()
            
            exercises = json.loads(content)
            return exercises if isinstance(exercises, list) else [exercises]
        except json.JSONDecodeError as e:
            print(f"Erro ao parsear JSON: {e}")
            print(f"Conteúdo recebido: {content[:500]}")
            return []
        except Exception as e:
            print(f"Erro ao gerar exercícios: {e}")
            return []
    
    async def generate_hint(self, exercise_id: int) -> str:
        return "Dica: Releia o enunciado com atenção e tente identificar as palavras-chave."

