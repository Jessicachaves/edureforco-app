import axios from 'axios';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:8000`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  me: () => api.get('/auth/me'),
};

export const exercisesAPI = {
  list: (params?: { subject?: string; difficulty?: string }) =>
    api.get('/exercises', { params }),
  
  get: (id: number) => api.get(`/exercises/${id}`),
  
  adaptive: (subject: string) => api.get(`/exercises/adaptive/${subject}`),
  
  check: (data: { exercise_id: number; user_answer: string; time_spent_seconds?: number }) =>
    api.post('/exercises/check', data),
};

export const progressAPI = {
  getAll: () => api.get('/progress'),
  
  dashboard: () => api.get('/progress/dashboard'),
  
  bySubject: (subject: string) => api.get(`/progress/subject/${subject}`),
};

export const gamificationAPI = {
  badges: () => api.get('/gamification/badges'),
  
  myBadges: () => api.get('/gamification/my-badges'),
  
  leaderboard: (limit?: number) => api.get('/gamification/leaderboard', { params: { limit } }),
  
  addXP: (amount: number) => api.post(`/gamification/add-xp/${amount}`),
};

export const aiAPI = {
  ask: (data: { question: string; subject: string; context?: string }) =>
    api.post('/ai/ask', data),
  
  explain: (data: { question: string; subject: string }) =>
    api.post('/ai/explain', data),
  
  generateExercise: (data: { subject: string; difficulty: string; topic: string; quantity?: number }) =>
    api.post('/ai/generate-exercise', data),
  
  hint: (exerciseId: number) => api.post('/ai/hint', { exercise_id: exerciseId }),
};

export const profileAPI = {
  get: () => api.get('/profile/me'),
  
  update: (data: { name?: string; grade?: string; avatar?: string; bio?: string }) =>
    api.put('/profile/me', data),
  
  grades: () => api.get('/profile/grades'),
};

