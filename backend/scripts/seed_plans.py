import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.subscription import Plan, PlanType
from app.models.user import User
from app.models.exercise import Exercise
from app.models.progress import Progress

def seed_plans():
    db = SessionLocal()
    
    plans_data = [
        {
            "name": "Grátis",
            "type": PlanType.FREE,
            "price_monthly": 0.0,
            "price_yearly": 0.0,
            "max_exercises_per_day": 10,
            "max_ai_questions_per_day": 5,
            "max_private_exercises_per_month": 5,
            "ocr_enabled": False,
            "ai_exercise_generation": False,
            "can_share_exercises": False,
            "custom_reports": False,
            "priority_support": False,
            "ad_free": False,
            "description": "Comece a estudar gratuitamente",
            "features": "10 exercícios/dia|5 perguntas IA/dia|5 exercícios privados/mês|SEM foto/OCR|Gamificação básica"
        },
        {
            "name": "Básico",
            "type": PlanType.BASIC,
            "price_monthly": 9.90,
            "price_yearly": 99.00,
            "max_exercises_per_day": 50,
            "max_ai_questions_per_day": 20,
            "max_private_exercises_per_month": 20,
            "ocr_enabled": False,
            "ai_exercise_generation": False,
            "can_share_exercises": False,
            "custom_reports": False,
            "priority_support": False,
            "ad_free": True,
            "description": "Para estudantes dedicados",
            "features": "50 exercícios/dia|20 perguntas IA/dia|20 exercícios privados/mês|SEM foto/OCR|Sem anúncios|Relatórios básicos"
        },
        {
            "name": "Premium",
            "type": PlanType.PREMIUM,
            "price_monthly": 19.90,
            "price_yearly": 199.00,
            "max_exercises_per_day": 200,
            "max_ai_questions_per_day": 100,
            "max_private_exercises_per_month": -1,
            "ocr_enabled": True,
            "ai_exercise_generation": True,
            "can_share_exercises": True,
            "custom_reports": True,
            "priority_support": True,
            "ad_free": True,
            "description": "Máximo desempenho nos estudos",
            "features": "200 exercícios/dia|100 perguntas IA/dia|Exercícios privados ILIMITADOS|📸 COM foto/OCR|Geração com IA|Compartilhar|Relatórios personalizados|Suporte prioritário"
        },
        {
            "name": "Enterprise",
            "type": PlanType.ENTERPRISE,
            "price_monthly": 49.90,
            "price_yearly": 499.00,
            "max_exercises_per_day": -1,
            "max_ai_questions_per_day": -1,
            "max_private_exercises_per_month": -1,
            "ocr_enabled": True,
            "ai_exercise_generation": True,
            "can_share_exercises": True,
            "custom_reports": True,
            "priority_support": True,
            "ad_free": True,
            "description": "Para escolas e instituições",
            "features": "TUDO ILIMITADO|📸 OCR ilimitado|Grupos/Turmas|Compartilhar|API access|Dashboard professor|Suporte 24/7|Personalização"
        }
    ]
    
    for plan_data in plans_data:
        existing = db.query(Plan).filter(Plan.type == plan_data["type"]).first()
        if not existing:
            plan = Plan(**plan_data)
            db.add(plan)
            print(f"✅ Plano '{plan_data['name']}' criado")
        else:
            print(f"⏭️  Plano '{plan_data['name']}' já existe")
    
    db.commit()
    print("\n🎉 Planos criados com sucesso!")
    db.close()

if __name__ == "__main__":
    print("💳 Criando planos de assinatura...")
    Base.metadata.create_all(bind=engine)
    seed_plans()

