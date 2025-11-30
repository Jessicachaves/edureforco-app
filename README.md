# 📚 EduReforço - Plataforma de Reforço Escolar com IA

Plataforma educacional completa com IA integrada, gamificação e sistema de exercícios personalizados.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** + **Next.js 14** - Framework web moderno
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

### Backend
- **Python 3.11+** com **FastAPI** - API REST
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação
- **Groq API** - IA para geração de exercícios
- **Tesseract OCR** - Reconhecimento de texto em imagens
- **Pillow** - Processamento de imagens

## ✨ Funcionalidades

- 🤖 **Tutor IA** - Assistente virtual para dúvidas
- 📝 **Exercícios Adaptativos** - Ajustados por série escolar
- 📸 **OCR** - Tire foto de exercícios e converta em digital
- 🎮 **Gamificação** - XP, níveis, badges e ranking
- 👤 **Perfil Personalizado** - Avatar, biografia e progresso
- 💎 **Planos de Assinatura** - Free, Basic, Premium e Enterprise
- 📊 **Dashboard** - Acompanhamento de desempenho
- 🎯 **Sessões de Estudo IA** - Exercícios gerados automaticamente

## 🛠️ Instalação

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- Tesseract OCR

### Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
copy .env.example .env
# Edite o .env com suas chaves

# Inicializar banco de dados
python scripts/seed_data.py
python scripts/seed_plans.py

# Iniciar servidor
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
copy .env.example .env.local
# Edite o .env.local com a URL do backend

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🔑 Configuração de APIs

### Groq API (IA)
1. Crie uma conta em https://console.groq.com/
2. Gere uma API key
3. Adicione ao `.env`: `GROQ_API_KEY=sua-chave-aqui`

### Tesseract OCR
**Windows:**
1. Baixe em: https://github.com/UB-Mannheim/tesseract/wiki
2. Instale e adicione ao PATH

**Linux:**
```bash
sudo apt install tesseract-ocr
```

## 📱 Acesso via Celular

Para testar no celular na mesma rede Wi-Fi:

1. Descubra seu IP local:
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/Mac
   ```

2. Inicie o backend com `--host 0.0.0.0`

3. No frontend, configure `NEXT_PUBLIC_API_URL` com seu IP:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.XXX:8000
   ```

4. Acesse no celular: `http://192.168.1.XXX:3000`

## 👤 Criar Usuário Admin

```bash
cd backend
python scripts/make_admin.py
```

## 💎 Planos de Assinatura

| Recurso | Free | Basic | Premium | Enterprise |
|---------|------|-------|---------|------------|
| Exercícios IA/dia | 5 | 20 | 100 | Ilimitado |
| Perguntas IA/dia | 10 | 50 | Ilimitado | Ilimitado |
| Exercícios privados/mês | 5 | 20 | 100 | Ilimitado |
| OCR (foto) | ❌ | ✅ | ✅ | ✅ |
| Compartilhar exercícios | ❌ | ❌ | ✅ | ✅ |

## 📂 Estrutura do Projeto

```
App cel/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Rotas da API
│   │   ├── models/          # Modelos do banco
│   │   ├── schemas/         # Schemas Pydantic
│   │   ├── services/        # Lógica de negócio
│   │   └── core/            # Configurações
│   ├── scripts/             # Scripts de inicialização
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Páginas Next.js
│   │   ├── components/      # Componentes React
│   │   ├── lib/             # Utilitários
│   │   └── store/           # Estado global
│   └── package.json
└── README.md
```

## 🚀 Deploy

### Backend (Render/Railway)
- Configure variáveis de ambiente
- Use PostgreSQL em produção
- Configure CORS para seu domínio

### Frontend (Vercel)
- Conecte ao repositório GitHub
- Configure `NEXT_PUBLIC_API_URL`
- Deploy automático

## 📝 Licença

Este projeto é de código aberto para fins educacionais.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

