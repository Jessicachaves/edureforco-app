import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import sqlite3

def update_plans_table():
    """
    Atualiza a tabela plans adicionando novos campos.
    SQLite não suporta ALTER COLUMN, então precisamos recriar a tabela.
    """
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'edureforco.db')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔧 Atualizando tabela de planos...")
        
        # Salvar dados existentes
        cursor.execute("SELECT * FROM plans")
        old_plans = cursor.fetchall()
        print(f"📦 {len(old_plans)} planos encontrados")
        
        # Dropar tabela antiga
        cursor.execute("DROP TABLE IF EXISTS plans")
        print("🗑️  Tabela antiga deletada")
        
        # Criar nova tabela com todos os campos
        cursor.execute("""
            CREATE TABLE plans (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL,
                type VARCHAR NOT NULL UNIQUE,
                price_monthly FLOAT DEFAULT 0.0,
                price_yearly FLOAT DEFAULT 0.0,
                max_exercises_per_day INTEGER DEFAULT 10,
                max_ai_questions_per_day INTEGER DEFAULT 5,
                max_private_exercises_per_month INTEGER DEFAULT 5,
                ocr_enabled BOOLEAN DEFAULT 0,
                ai_exercise_generation BOOLEAN DEFAULT 0,
                can_share_exercises BOOLEAN DEFAULT 0,
                custom_reports BOOLEAN DEFAULT 0,
                priority_support BOOLEAN DEFAULT 0,
                ad_free BOOLEAN DEFAULT 0,
                description VARCHAR,
                features VARCHAR
            )
        """)
        print("✅ Nova tabela criada com campos adicionais")
        
        # Também atualizar usage_tracker
        cursor.execute("DROP TABLE IF EXISTS usage_tracker")
        cursor.execute("""
            CREATE TABLE usage_tracker (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                exercises_today INTEGER DEFAULT 0,
                ai_questions_today INTEGER DEFAULT 0,
                private_exercises_this_month INTEGER DEFAULT 0,
                last_reset_date DATETIME,
                last_monthly_reset DATETIME,
                updated_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        print("✅ Tabela usage_tracker atualizada")
        
        # Também atualizar subscriptions se houver
        try:
            cursor.execute("DROP TABLE IF EXISTS subscriptions")
            cursor.execute("""
                CREATE TABLE subscriptions (
                    id INTEGER PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    plan_id INTEGER NOT NULL,
                    status VARCHAR DEFAULT 'active',
                    start_date DATETIME,
                    end_date DATETIME,
                    is_trial BOOLEAN DEFAULT 0,
                    auto_renew BOOLEAN DEFAULT 1,
                    payment_method VARCHAR,
                    last_payment_date DATETIME,
                    next_payment_date DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (plan_id) REFERENCES plans(id)
                )
            """)
            print("✅ Tabela subscriptions atualizada")
        except Exception as e:
            print(f"⚠️  Subscriptions: {e}")
        
        conn.commit()
        print("\n🎉 Tabelas atualizadas com sucesso!")
        print("📝 Execute agora: python scripts/seed_plans.py")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    update_plans_table()




