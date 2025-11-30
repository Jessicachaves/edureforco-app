from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, exercises, progress, gamification, ai_tutor, admin, subscriptions, profile, community, usage, permissions

app = FastAPI(
    title="EduReforço API",
    description="API de reforço escolar com IA",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

origins = settings.CORS_ORIGINS.copy()
if settings.ENVIRONMENT == "development":
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if settings.ENVIRONMENT != "development" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticação"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["Perfil"])
app.include_router(permissions.router, prefix="/api/v1/permissions", tags=["Permissões"])
app.include_router(exercises.router, prefix="/api/v1/exercises", tags=["Exercícios"])
app.include_router(community.router, prefix="/api/v1/community", tags=["Comunidade"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Progresso"])
app.include_router(gamification.router, prefix="/api/v1/gamification", tags=["Gamificação"])
app.include_router(ai_tutor.router, prefix="/api/v1/ai", tags=["IA Tutor"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Assinaturas"])
app.include_router(usage.router, prefix="/api/v1/usage", tags=["Uso"])

@app.get("/")
async def root():
    return {
        "message": "EduReforço API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

