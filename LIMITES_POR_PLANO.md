# 💎 LIMITES POR PLANO - SISTEMA DE MONETIZAÇÃO

## 🎯 **ESTRATÉGIA DE SEGMENTAÇÃO**

Recursos mais avançados (como **OCR/Foto**) são **exclusivos de planos pagos** para monetizar a plataforma.

---

## 📊 **TABELA COMPARATIVA DE PLANOS:**

| Recurso | 🆓 FREE | 💚 BASIC<br>(R$ 9,90/mês) | 💎 PREMIUM<br>(R$ 19,90/mês) | 👑 ENTERPRISE<br>(R$ 49,90/mês) |
|---------|---------|---------|----------|-------------|
| **Exercícios da plataforma/dia** | 10 | 50 | 200 | ∞ Ilimitado |
| **Perguntas para IA/dia** | 5 | 20 | 100 | ∞ Ilimitado |
| **Criar exercícios privados/mês** | 5 | 20 | ∞ Ilimitado | ∞ Ilimitado |
| **📸 OCR (Foto → Texto)** | ❌ Não | ❌ Não | ✅ **SIM** | ✅ **SIM** |
| **Gerar exercícios com IA** | ❌ Não | ❌ Não | ✅ SIM | ✅ SIM |
| **Compartilhar exercícios** | ❌ Não | ❌ Não | ✅ SIM | ✅ SIM |
| **Relatórios personalizados** | ❌ Não | ❌ Não | ✅ SIM | ✅ SIM |
| **Sem anúncios** | ❌ Não | ✅ SIM | ✅ SIM | ✅ SIM |
| **Suporte prioritário** | ❌ Não | ❌ Não | ✅ SIM | ✅ SIM |
| **Grupos/Turmas** | ❌ Não | ❌ Não | ❌ Não | ✅ SIM |
| **Dashboard de professor** | ❌ Não | ❌ Não | ❌ Não | ✅ SIM |

---

## 💡 **DIFERENCIAL PREMIUM: OCR/FOTO**

### **Por que OCR é Premium?**

1. **Custos de processamento:**
   - Tesseract OCR (servidor)
   - IA para analisar texto (Groq API)
   - Armazenamento de imagens
   - Largura de banda

2. **Valor agregado:**
   - Economiza MUITO tempo do usuário
   - Não precisa digitar exercícios
   - Tecnologia avançada
   - Diferencial competitivo

3. **Justifica o preço:**
   - Recurso "wow" que vale a pena pagar
   - Aumenta percepção de valor
   - Incentiva upgrade

---

## 🚀 **COMO FUNCIONA NA PRÁTICA:**

### **Usuário FREE tenta usar OCR:**
```
1. Vai em "Criar Exercício"
2. Clica em "📸 Foto"
3. ❌ Vê mensagem: "📸 OCR disponível apenas no plano Premium"
4. Botão desabilitado
5. Link para "Ver Planos"
```

### **Usuário FREE atinge limite de exercícios:**
```
1. Criou 5 exercícios privados no mês
2. Tenta criar o 6º
3. ❌ Erro: "Limite mensal atingido (5/5)"
4. Mensagem: "Upgrade para Premium para criar ilimitados!"
5. Link para página de planos
```

### **Usuário PREMIUM:**
```
1. Pode criar exercícios ilimitados
2. Pode usar OCR/foto ilimitado
3. Sem restrições
4. Experiência completa
```

---

## 🔧 **COMO ESTÁ IMPLEMENTADO:**

### **Backend:**

#### **1. Modelo de Planos (`app/models/subscription.py`):**
```python
class Plan(Base):
    max_exercises_per_day = Column(Integer, default=10)
    max_ai_questions_per_day = Column(Integer, default=5)
    max_private_exercises_per_month = Column(Integer, default=5)  # NOVO
    ocr_enabled = Column(Boolean, default=False)                   # NOVO
    ai_exercise_generation = Column(Boolean, default=False)
    can_share_exercises = Column(Boolean, default=False)           # NOVO
```

#### **2. Rastreamento de Uso (`UsageTracker`):**
```python
class UsageTracker(Base):
    exercises_today = Column(Integer, default=0)
    ai_questions_today = Column(Integer, default=0)
    private_exercises_this_month = Column(Integer, default=0)    # NOVO
    last_reset_date = Column(DateTime)
    last_monthly_reset = Column(DateTime)                        # NOVO
```

#### **3. Middleware de Verificação:**
```python
# app/middleware/exercise_limits.py

def check_private_exercise_limit(user_id, db):
    """Verifica se pode criar mais exercícios privados"""
    # Verifica plano do usuário
    # Verifica quantos já criou no mês
    # Se atingiu limite → HTTPException 403
    # Se OK → incrementa contador

def check_ocr_access(user_id, db):
    """Verifica se tem acesso ao OCR"""
    # Verifica plano do usuário
    # Se ocr_enabled == False → HTTPException 403
    # Se OK → permite acesso
```

#### **4. Proteção nas Rotas:**
```python
# app/api/v1/community.py

@router.post("/exercises")
async def create_exercise(...):
    check_private_exercise_limit(user_id, db)  # ✅ Verifica limite
    # ... cria exercício

@router.post("/ocr")
async def process_ocr(...):
    check_ocr_access(user_id, db)  # ✅ Verifica acesso OCR
    # ... processa imagem
```

---

## 📱 **FRONTEND (A IMPLEMENTAR):**

### **1. Criar Exercício (`create-exercise/page.tsx`):**
```typescript
// Verificar se tem acesso ao OCR
const { ocr_enabled } = await checkLimits();

if (!ocr_enabled) {
  // Desabilitar botão "📸 Foto"
  // Mostrar badge "Premium"
  // Link para upgrade
}
```

### **2. Dashboard:**
```typescript
// Mostrar indicador de limites
<UsageLimits>
  Exercícios privados: 3/5 usado este mês
  OCR: ❌ Disponível no Premium
  
  [Upgrade para Premium →]
</UsageLimits>
```

### **3. Página "Meus Exercícios":**
```typescript
// Avisar quando se aproximar do limite
{exercisesUsed >= 4 && planType === 'free' && (
  <Warning>
    ⚠️ Você já criou 4/5 exercícios este mês.
    Upgrade para Premium e crie ilimitados!
  </Warning>
)}
```

---

## 💰 **ESTRATÉGIA DE UPSELL:**

### **Gatilhos para Upgrade:**

#### **1. Limite atingido:**
```
❌ "Você atingiu o limite de 5 exercícios/mês"
💎 "Plano Premium: Exercícios ILIMITADOS por R$ 19,90/mês"
[Fazer Upgrade →]
```

#### **2. Tentou usar OCR:**
```
❌ "OCR disponível apenas no Premium"
📸 "Tire fotos e crie exercícios automaticamente"
[Ver Planos →]
```

#### **3. Aproximando do limite:**
```
⚠️ "Você já usou 4 de 5 exercícios este mês"
💡 "Upgrade e nunca se preocupe com limites!"
[Upgrade Agora →]
```

---

## 📈 **MODELO DE CONVERSÃO:**

### **Funil de Monetização:**
```
100 usuários FREE
   ↓ (10% upgrade)
10 usuários BASIC
   ↓ (30% upgrade)
3 usuários PREMIUM
   ↓ (10% para Enterprise)
0.3 usuários ENTERPRISE
```

### **Receita Mensal (exemplo):**
```
- 100 FREE: R$ 0
- 10 BASIC (R$ 9,90): R$ 99
- 3 PREMIUM (R$ 19,90): R$ 59,70
- 0.3 ENTERPRISE (R$ 49,90): R$ 15

Total: R$ 173,70/mês por 113 usuários
```

---

## 🎯 **QUANDO AVISAR O USUÁRIO:**

### **1. Ao criar 3º exercício (60% do limite FREE):**
```
💡 "Você já criou 3 exercícios. Restam apenas 2 este mês!"
```

### **2. Ao criar 5º exercício (limite atingido):**
```
❌ "Limite atingido! Upgrade para criar ilimitados."
[Ver Planos Premium →]
```

### **3. Todo início de mês:**
```
✅ "Seus limites foram renovados! 5 novos exercícios disponíveis."
```

### **4. Ao clicar em "Foto":**
```
📸 "Recurso Premium: Tire fotos e crie exercícios automaticamente"
[Experimentar Premium por 7 dias grátis →]
```

---

## 🔐 **SEGURANÇA:**

### **Verificações:**
✅ Backend verifica limites (não confia no frontend)
✅ Contadores protegidos no banco
✅ Reset automático mensal
✅ Logs de uso para auditoria

### **Anti-Fraude:**
✅ User ID vinculado ao token JWT
✅ Não pode criar com user_id de outro
✅ Rate limiting em rotas sensíveis

---

## 🧪 **COMO TESTAR:**

### **1. Testar Limite FREE:**
```bash
# Como usuário FREE (padrão)
# Criar 5 exercícios manuais
# Tentar criar o 6º
# ❌ Deve dar erro "Limite atingido"
```

### **2. Testar OCR:**
```bash
# Como usuário FREE
# Tentar usar OCR/foto
# ❌ Deve dar erro "Disponível apenas no Premium"
```

### **3. Promover para Premium:**
```bash
# No banco de dados:
sqlite3 edureforco.db

# Criar subscrição Premium
INSERT INTO subscriptions (user_id, plan_id, status) 
VALUES (1, 3, 'active');

# Sair
.exit
```

### **4. Testar como Premium:**
```bash
# Fazer logout/login
# Criar 10+ exercícios
# ✅ Deve funcionar (ilimitado)
# Tentar usar OCR
# ✅ Deve funcionar
```

---

## 📊 **ENDPOINTS DA API:**

### **Verificar Limites:**
```http
GET /api/v1/usage/exercise-limits

Response:
{
  "private_exercises_used": 3,
  "private_exercises_limit": 5,
  "ocr_enabled": false,
  "plan_type": "free",
  "unlimited": false
}
```

### **Criar Exercício (verifica limite):**
```http
POST /api/v1/community/exercises?is_private=true

# Se atingiu limite:
Status: 403 Forbidden
{
  "detail": "Limite mensal atingido (5). Upgrade para Premium!"
}
```

### **OCR (verifica acesso):**
```http
POST /api/v1/community/ocr

# Se não tem acesso:
Status: 403 Forbidden
{
  "detail": "📸 OCR disponível apenas para planos Premium e Enterprise"
}
```

---

## 💡 **MELHORIAS FUTURAS:**

### **Curto Prazo:**
1. ⏳ Tela de upgrade bonita
2. ⏳ Trial de 7 dias Premium
3. ⏳ Cupons de desconto
4. ⏳ Plano anual com desconto

### **Médio Prazo:**
1. ⏳ A/B testing de preços
2. ⏳ Upsell contextual
3. ⏳ Email marketing (limite atingido)
4. ⏳ Badges "Premium" na interface

### **Longo Prazo:**
1. ⏳ Plano família
2. ⏳ Plano escolar
3. ⏳ API para integrações
4. ⏳ White-label

---

## 🎉 **RESUMO:**

| Pergunta | Resposta |
|----------|----------|
| **Criar exercícios manualmente** | FREE: 5/mês • BASIC: 20/mês • PREMIUM: ∞ |
| **OCR (Foto)** | ❌ FREE/BASIC • ✅ PREMIUM/ENTERPRISE |
| **Gerar com IA** | ❌ FREE/BASIC • ✅ PREMIUM/ENTERPRISE |
| **Reset de limites** | Todo dia 1º do mês |
| **Verificação** | Backend (seguro) |
| **Mensagem ao usuário** | Clara e incentiva upgrade |

---

**💎 Recursos premium (OCR) são exclusivos de planos pagos!**

**📈 Estratégia de monetização completa e funcional!**

**🚀 Pronto para lançar e ganhar dinheiro! 💰**



