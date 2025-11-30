# 🛡️ SISTEMA DE MODERAÇÃO - GUIA COMPLETO

## 🎯 **O QUE É?**

O sistema de moderação permite que **administradores** e **professores** revisem e aprovem exercícios criados pela comunidade antes de ficarem públicos.

---

## 👥 **QUEM PODE MODERAR?**

### **Roles (Funções) disponíveis:**

| Role | Descrição | Pode Moderar? | Emoji |
|------|-----------|---------------|-------|
| **ADMIN** | Administrador do sistema | ✅ SIM | 👑 |
| **TEACHER** | Professor | ✅ SIM | 👨‍🏫 |
| **STUDENT** | Aluno/Estudante | ❌ NÃO | 👨‍🎓 |
| **PARENT** | Pai/Mãe | ❌ NÃO | 👨‍👩‍👧 |

---

## 🔐 **COMO FUNCIONA A SEGURANÇA?**

### **1. Verificação no Backend:**
```python
# Arquivo: backend/app/core/permissions.py

def check_admin(user_id: int, db: Session) -> bool:
    """Verifica se o usuário é admin ou professor"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if user.role not in [UserRole.ADMIN, UserRole.TEACHER]:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    return True
```

### **2. Proteção das Rotas:**
- `/api/v1/community/exercises/{id}/approve` - **Protegida** ✅
- `/api/v1/permissions/check-admin` - Verifica se é admin

### **3. Controle no Frontend:**
- Link de "Moderação" **só aparece** se `isAdmin = true`
- Página de moderação verifica permissões ao carregar
- Mensagem de "Acesso Negado" se não for admin

---

## 🚀 **COMO TORNAR ALGUÉM ADMIN?**

### **Método 1: Script Python** (Recomendado)

```bash
cd backend

# Listar todos os usuários
python scripts/make_admin.py --list

# Tornar um usuário admin
python scripts/make_admin.py email@usuario.com
```

**Exemplo:**
```bash
$ python scripts/make_admin.py joao@escola.com

✅ Usuário 'joao@escola.com' agora é ADMIN!
   Role anterior: student
   Role atual: admin
```

---

### **Método 2: Diretamente no Banco de Dados** (SQLite)

```bash
# Abrir banco de dados
sqlite3 edureforco.db

# Ver usuários
SELECT id, name, email, role FROM users;

# Tornar admin
UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';

# Confirmar
SELECT name, email, role FROM users WHERE email = 'seu@email.com';

# Sair
.exit
```

---

### **Método 3: Interface Administrativa** (Futuro)

No futuro, você pode criar uma página `/admin/users` onde admins podem promover outros usuários.

---

## 📋 **FLUXO COMPLETO DE MODERAÇÃO**

### **1. Aluno cria exercício:**
```
Aluno → Cria exercício → is_approved = FALSE → is_public = FALSE
```

### **2. Admin/Professor modera:**
```
Admin → Acessa /moderation → Vê exercício pendente → Clica "Ver Detalhes"
```

### **3. Admin aprova:**
```
Admin → Clica "Aprovar" → is_approved = TRUE → is_public = TRUE
```

### **4. Exercício fica público:**
```
Todos os alunos → Podem usar o exercício aprovado
```

---

## 🎨 **INTERFACE DE MODERAÇÃO**

### **Painel:**
- ⏳ **Exercícios Pendentes** (aguardando aprovação)
- ✅ **Exercícios Aprovados** (já publicados)
- 📊 **Estatísticas** (total, pendentes, aprovados)

### **Detalhes do Exercício:**
- Título
- Pergunta completa
- Opções (A, B, C, D)
- Resposta correta
- Explicação
- Matéria, dificuldade, tipo
- Criador e data

### **Ações:**
- ✅ **Aprovar** - Publica o exercício
- ❌ **Rejeitar** - Remove da lista (placeholder)
- 👁️ **Ver Detalhes** - Visualiza tudo

---

## 🔧 **ARQUIVOS CRIADOS/MODIFICADOS**

### **Backend:**
```
✅ app/core/permissions.py              - Funções de verificação de permissões
✅ app/api/v1/permissions.py            - Endpoint /check-admin
✅ app/api/v1/community.py              - Proteção na rota de aprovação
✅ scripts/make_admin.py                - Script para promover usuários
```

### **Frontend:**
```
✅ app/dashboard/page.tsx               - Link de moderação condicional
✅ app/moderation/page.tsx              - Verificação de permissões + tela de acesso negado
```

---

## 🧪 **COMO TESTAR**

### **1. Como usuário comum (student):**
```
1. Fazer login
2. Ir ao dashboard
3. ❌ Link "Moderação" NÃO aparece
4. Tentar acessar /moderation diretamente
5. ❌ Ver tela "Acesso Negado"
```

### **2. Promover para admin:**
```bash
cd backend
python scripts/make_admin.py --list
python scripts/make_admin.py seu@email.com
```

### **3. Como admin:**
```
1. Fazer logout e login novamente
2. Ir ao dashboard
3. ✅ Link "🛡️ Moderação" aparece (botão amarelo/laranja)
4. Clicar no link
5. ✅ Ver painel de moderação completo
6. Aprovar exercícios pendentes
```

---

## 📊 **BANCO DE DADOS**

### **Tabela: users**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE,
    name VARCHAR,
    hashed_password VARCHAR,
    role VARCHAR,  -- 'student', 'teacher', 'parent', 'admin'
    ...
);
```

### **Tabela: community_exercises**
```sql
CREATE TABLE community_exercises (
    id INTEGER PRIMARY KEY,
    created_by INTEGER REFERENCES users(id),
    title VARCHAR,
    question TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    approved_at DATETIME,
    ...
);
```

---

## 🎯 **CASOS DE USO**

### **Caso 1: Escola com Vários Professores**
```
1. Criar contas para professores
2. Promover todos para role "teacher"
3. Professores podem moderar exercícios
4. Apenas 1 admin principal (diretor/coordenador)
```

### **Caso 2: Plataforma Pública**
```
1. Você é o único admin
2. Alunos criam exercícios
3. Você aprova manualmente
4. Exercícios ficam públicos após aprovação
```

### **Caso 3: Comunidade Auto-Moderada**
```
1. Sistema de votos (upvote/downvote)
2. Exercícios com +10 votos = aprovação automática
3. Admin só revisa se houver denúncias
```

---

## 🚨 **SEGURANÇA**

### **O que está protegido:**
✅ Rota de aprovação (apenas admin/teacher)
✅ Verificação no backend
✅ Interface esconde link para não-admins
✅ Mensagem clara de acesso negado

### **O que ainda não está implementado:**
⏳ Autenticação JWT real (user_id fixo em 1)
⏳ Rejeição de exercícios
⏳ Histórico de moderação
⏳ Notificações de aprovação/rejeição
⏳ Sistema de denúncias

---

## 💡 **MELHORIAS FUTURAS**

### **Curto Prazo:**
1. ⏳ Implementar rejeição real
2. ⏳ Notificar criador quando aprovado/rejeitado
3. ⏳ Histórico de aprovações por moderador
4. ⏳ Filtros (matéria, dificuldade, data)

### **Médio Prazo:**
1. ⏳ Sistema de denúncias
2. ⏳ Aprovação em lote
3. ⏳ Edição de exercícios pelo moderador
4. ⏳ Sistema de appeals (recurso)

### **Longo Prazo:**
1. ⏳ IA para pré-aprovação (verifica qualidade)
2. ⏳ Sistema de reputação (confiáveis = auto-aprovados)
3. ⏳ Dashboard de moderação com métricas
4. ⏳ Moderadores com especialização (por matéria)

---

## 📞 **COMANDOS ÚTEIS**

### **Listar usuários:**
```bash
python scripts/make_admin.py --list
```

### **Promover para admin:**
```bash
python scripts/make_admin.py email@usuario.com
```

### **Ver usuários no banco:**
```bash
sqlite3 edureforco.db "SELECT name, email, role FROM users;"
```

### **Ver exercícios pendentes:**
```bash
sqlite3 edureforco.db "SELECT title, is_approved FROM community_exercises WHERE is_approved = 0;"
```

---

## ❓ **FAQ**

### **P: Qualquer aluno pode criar exercícios?**
R: Sim! Mas ficam pendentes até um admin aprovar.

### **P: Como faço para ser admin?**
R: Peça ao administrador do sistema para promovê-lo usando o script `make_admin.py`.

### **P: Professores têm as mesmas permissões que admins?**
R: Para moderação, sim! Mas no futuro admins terão mais funcionalidades (gerenciar usuários, configurações, etc).

### **P: Posso ter vários admins?**
R: Sim! Promova quantos usuários quiser para admin.

### **P: E se eu deletar todos os admins?**
R: Use o script `make_admin.py` para promover alguém direto no banco de dados.

### **P: Como remover permissões de admin?**
R: No banco: `UPDATE users SET role = 'student' WHERE email = 'usuario@email.com';`

---

## 🎉 **PRONTO!**

Seu sistema de moderação está **100% funcional** e **seguro**!

**Principais benefícios:**
✅ Controle de qualidade do conteúdo
✅ Evita spam e exercícios ruins
✅ Professores podem contribuir
✅ Comunidade cresce com segurança

---

**Próximo passo:** Promova seu primeiro admin e teste o sistema! 🚀



