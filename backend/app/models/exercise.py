from sqlalchemy import Column, Integer, String, Text, Float, Enum, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class Subject(str, enum.Enum):
    MATEMATICA = "matematica"
    PORTUGUES = "portugues"
    CIENCIAS = "ciencias"
    HISTORIA = "historia"
    GEOGRAFIA = "geografia"
    INGLES = "ingles"
    FISICA = "fisica"
    QUIMICA = "quimica"
    BIOLOGIA = "biologia"

class Difficulty(str, enum.Enum):
    FACIL = "facil"
    MEDIO = "medio"
    DIFICIL = "dificil"
    DESAFIO = "desafio"

class ExerciseType(str, enum.Enum):
    MULTIPLA_ESCOLHA = "multipla_escolha"
    VERDADEIRO_FALSO = "verdadeiro_falso"
    DISSERTATIVA = "dissertativa"
    COMPLETAR = "completar"
    ASSOCIACAO = "associacao"

class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    subject = Column(Enum(Subject), nullable=False)
    difficulty = Column(Enum(Difficulty), nullable=False)
    type = Column(Enum(ExerciseType), nullable=False)
    
    options = Column(JSON, nullable=True)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    
    xp_reward = Column(Integer, default=10)
    hints = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("ExerciseAttempt", back_populates="exercise")



