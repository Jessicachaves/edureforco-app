import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import Base, engine
from app.models.user import User
from app.models.exercise import Exercise
from app.models.progress import Progress
from app.models.subscription import Plan, Subscription
from app.models.community_exercise import CommunityExercise, ExerciseOCR

def create_tables():
    print("🔨 Criando novas tabelas...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tabelas criadas com sucesso!")
    print("\nTabelas disponíveis:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")

if __name__ == "__main__":
    create_tables()

