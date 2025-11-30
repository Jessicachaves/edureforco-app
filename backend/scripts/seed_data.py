import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.exercise import Exercise, Subject, Difficulty, ExerciseType
from app.models.progress import Badge, Progress
from app.core.security import get_password_hash

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Tabelas criadas")

def seed_users():
    db = SessionLocal()
    
    users_data = [
        {"email": "aluno@teste.com", "name": "João Silva", "password": "senha123", "level": 3, "xp": 450, "streak_days": 7, "grade": "7ano-fundamental", "avatar": "😊", "bio": "Adoro matemática!"},
        {"email": "maria@teste.com", "name": "Maria Santos", "password": "senha123", "level": 5, "xp": 820, "streak_days": 12, "grade": "2ano-medio", "avatar": "🤓", "bio": "Estudando para o vestibular"},
        {"email": "pedro@teste.com", "name": "Pedro Costa", "password": "senha123", "level": 2, "xp": 180, "streak_days": 3, "grade": "5ano-fundamental", "avatar": "🚀", "bio": "Aprendendo todos os dias!"},
    ]
    
    for user_data in users_data:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            user = User(
                email=user_data["email"],
                name=user_data["name"],
                hashed_password=get_password_hash(user_data["password"]),
                level=user_data["level"],
                xp=user_data["xp"],
                streak_days=user_data["streak_days"],
                grade=user_data.get("grade"),
                avatar=user_data.get("avatar"),
                bio=user_data.get("bio")
            )
            db.add(user)
    
    db.commit()
    print("✅ Usuários criados")
    db.close()

def seed_exercises():
    db = SessionLocal()
    
    exercises_data = [
        {
            "title": "Equação de Primeiro Grau",
            "question": "Resolva a equação: 2x + 5 = 15",
            "subject": Subject.MATEMATICA,
            "difficulty": Difficulty.FACIL,
            "type": ExerciseType.MULTIPLA_ESCOLHA,
            "options": {"a": "x = 3", "b": "x = 5", "c": "x = 7", "d": "x = 10"},
            "correct_answer": "b",
            "explanation": "Para resolver: 2x + 5 = 15, subtraímos 5 de ambos os lados: 2x = 10. Dividindo por 2: x = 5",
            "xp_reward": 10,
            "hints": ["Isole a variável x", "Primeiro subtraia 5 de ambos os lados"]
        },
        {
            "title": "Interpretação de Texto",
            "question": "No texto 'O gato dormia tranquilamente sob a árvore', qual é o sujeito da oração?",
            "subject": Subject.PORTUGUES,
            "difficulty": Difficulty.FACIL,
            "type": ExerciseType.MULTIPLA_ESCOLHA,
            "options": {"a": "O gato", "b": "dormia", "c": "tranquilamente", "d": "sob a árvore"},
            "correct_answer": "a",
            "explanation": "O sujeito é quem pratica a ação. Quem dormia? O gato. Portanto, 'O gato' é o sujeito.",
            "xp_reward": 10,
            "hints": ["Pergunte-se: quem pratica a ação?"]
        },
        {
            "title": "Fotossíntese",
            "question": "Qual é o principal produto da fotossíntese?",
            "subject": Subject.CIENCIAS,
            "difficulty": Difficulty.MEDIO,
            "type": ExerciseType.MULTIPLA_ESCOLHA,
            "options": {"a": "Oxigênio", "b": "Glicose", "c": "Água", "d": "Gás carbônico"},
            "correct_answer": "b",
            "explanation": "A fotossíntese produz glicose (açúcar) e oxigênio. A glicose é o produto principal usado pela planta como energia.",
            "xp_reward": 15,
            "hints": ["Pense no que as plantas usam como energia"]
        },
        {
            "title": "Teorema de Pitágoras",
            "question": "Em um triângulo retângulo com catetos 3 e 4, qual é a hipotenusa?",
            "subject": Subject.MATEMATICA,
            "difficulty": Difficulty.MEDIO,
            "type": ExerciseType.MULTIPLA_ESCOLHA,
            "options": {"a": "5", "b": "6", "c": "7", "d": "8"},
            "correct_answer": "a",
            "explanation": "Pelo Teorema de Pitágoras: a² + b² = c². Então: 3² + 4² = c². 9 + 16 = 25. c = √25 = 5",
            "xp_reward": 20,
            "hints": ["Use a fórmula a² + b² = c²"]
        },
        {
            "title": "Independência do Brasil",
            "question": "Em que ano ocorreu a Independência do Brasil?",
            "subject": Subject.HISTORIA,
            "difficulty": Difficulty.FACIL,
            "type": ExerciseType.MULTIPLA_ESCOLHA,
            "options": {"a": "1500", "b": "1822", "c": "1889", "d": "1930"},
            "correct_answer": "b",
            "explanation": "A Independência do Brasil foi proclamada por Dom Pedro I em 7 de setembro de 1822.",
            "xp_reward": 10,
            "hints": ["Pense no grito do Ipiranga"]
        },
    ]
    
    for ex_data in exercises_data:
        existing = db.query(Exercise).filter(Exercise.title == ex_data["title"]).first()
        if not existing:
            exercise = Exercise(**ex_data)
            db.add(exercise)
    
    db.commit()
    print("✅ Exercícios criados")
    db.close()

def seed_badges():
    db = SessionLocal()
    
    badges_data = [
        {
            "name": "Primeiro Passo",
            "description": "Complete seu primeiro exercício",
            "icon": "🎯",
            "requirement": "1 exercício completo",
            "xp_bonus": 50
        },
        {
            "name": "Estudioso",
            "description": "Complete 10 exercícios",
            "icon": "📚",
            "requirement": "10 exercícios completos",
            "xp_bonus": 100
        },
        {
            "name": "Sequência de Fogo",
            "description": "Mantenha 7 dias seguidos",
            "icon": "🔥",
            "requirement": "7 dias de sequência",
            "xp_bonus": 150
        },
        {
            "name": "Mestre da Matemática",
            "description": "Acerte 20 questões de matemática",
            "icon": "🧮",
            "requirement": "20 exercícios de matemática corretos",
            "xp_bonus": 200
        },
        {
            "name": "Campeão",
            "description": "Alcance o Top 10 do ranking",
            "icon": "🏆",
            "requirement": "Top 10 do ranking",
            "xp_bonus": 300
        },
    ]
    
    for badge_data in badges_data:
        existing = db.query(Badge).filter(Badge.name == badge_data["name"]).first()
        if not existing:
            badge = Badge(**badge_data)
            db.add(badge)
    
    db.commit()
    print("✅ Badges criadas")
    db.close()

def seed_progress():
    db = SessionLocal()
    
    user = db.query(User).filter(User.email == "aluno@teste.com").first()
    if user:
        subjects = ["matematica", "portugues", "ciencias"]
        for subject in subjects:
            existing = db.query(Progress).filter(
                Progress.user_id == user.id,
                Progress.subject == subject
            ).first()
            
            if not existing:
                progress = Progress(
                    user_id=user.id,
                    subject=subject,
                    total_exercises=10,
                    correct_exercises=7,
                    accuracy=70.0,
                    time_spent_minutes=45
                )
                db.add(progress)
        
        db.commit()
        print("✅ Progresso inicial criado")
    
    db.close()

if __name__ == "__main__":
    print("🌱 Iniciando seed do banco de dados...")
    create_tables()
    seed_users()
    seed_exercises()
    seed_badges()
    seed_progress()
    print("🎉 Seed concluído com sucesso!")

