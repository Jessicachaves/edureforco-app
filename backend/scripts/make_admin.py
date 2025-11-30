import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models.user import User, UserRole

def make_user_admin(user_email: str):
    """Torna um usuário administrador"""
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.email == user_email).first()
        
        if not user:
            print(f"❌ Usuário com email '{user_email}' não encontrado!")
            print("\nUsuários existentes:")
            users = db.query(User).all()
            for u in users:
                print(f"  - {u.email} (ID: {u.id}, Role: {u.role.value})")
            return
        
        old_role = user.role.value
        user.role = UserRole.ADMIN
        db.commit()
        
        print(f"✅ Usuário '{user.email}' agora é ADMIN!")
        print(f"   Role anterior: {old_role}")
        print(f"   Role atual: {user.role.value}")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        db.rollback()
    finally:
        db.close()

def list_users():
    """Lista todos os usuários e seus roles"""
    db = SessionLocal()
    
    try:
        users = db.query(User).all()
        
        if not users:
            print("❌ Nenhum usuário encontrado!")
            return
        
        print("\n📋 Usuários cadastrados:")
        print("-" * 70)
        for user in users:
            role_emoji = "👑" if user.role == UserRole.ADMIN else "👨‍🏫" if user.role == UserRole.TEACHER else "👨‍🎓"
            print(f"{role_emoji} {user.name}")
            print(f"   Email: {user.email}")
            print(f"   ID: {user.id}")
            print(f"   Role: {user.role.value}")
            print(f"   Criado em: {user.created_at}")
            print("-" * 70)
        
    except Exception as e:
        print(f"❌ Erro: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🛡️  GERENCIAMENTO DE ADMINISTRADORES\n")
    
    if len(sys.argv) < 2:
        print("📖 Uso:")
        print("   python scripts/make_admin.py <email>          # Tornar usuário admin")
        print("   python scripts/make_admin.py --list           # Listar todos os usuários")
        print("\nExemplos:")
        print("   python scripts/make_admin.py admin@email.com")
        print("   python scripts/make_admin.py --list")
        sys.exit(1)
    
    if sys.argv[1] == "--list":
        list_users()
    else:
        email = sys.argv[1]
        make_user_admin(email)




