export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  ADMIN = 'admin',
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  level: number;
  xp: number;
  streak_days: number;
  is_active: boolean;
  created_at: string;
  grade?: string;
  avatar?: string;
  bio?: string;
}

export enum Subject {
  MATEMATICA = 'matematica',
  PORTUGUES = 'portugues',
  CIENCIAS = 'ciencias',
  HISTORIA = 'historia',
  GEOGRAFIA = 'geografia',
  INGLES = 'ingles',
  FISICA = 'fisica',
  QUIMICA = 'quimica',
  BIOLOGIA = 'biologia',
}

export enum Difficulty {
  FACIL = 'facil',
  MEDIO = 'medio',
  DIFICIL = 'dificil',
  DESAFIO = 'desafio',
}

export interface Exercise {
  id: number;
  title: string;
  question: string;
  subject: Subject;
  difficulty: Difficulty;
  type: string;
  options?: Record<string, string>;
  explanation?: string;
  xp_reward: number;
  hints?: string[];
  created_at: string;
}

export interface Progress {
  id: number;
  subject: string;
  total_exercises: number;
  correct_exercises: number;
  accuracy: number;
  time_spent_minutes: number;
  last_study: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned_at?: string;
}

export interface DashboardStats {
  total_xp: number;
  level: number;
  streak_days: number;
  total_exercises: number;
  accuracy: number;
  subjects_progress: Progress[];
  recent_badges: Badge[];
  ranking_position?: number;
}

