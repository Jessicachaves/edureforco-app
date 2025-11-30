'use client';

import { useState, useEffect } from 'react';
import { Trophy, Zap, Crown } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

interface UsageStats {
  exercises_used: number;
  exercises_limit: number;
  ai_questions_used: number;
  ai_questions_limit: number;
  plan_type: string;
}

export default function UsageLimits() {
  const [stats, setStats] = useState<UsageStats | null>(null);

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
    ? `http://${hostname}:8000` 
    : 'http://localhost:8000';

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/usage/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar limites:', error);
    }
  };

  if (!stats) return null;

  const exercisePercent = (stats.exercises_used / stats.exercises_limit) * 100;
  const aiPercent = (stats.ai_questions_used / stats.ai_questions_limit) * 100;

  const isNearLimit = exercisePercent > 70 || aiPercent > 70;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Uso Diário</h3>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
          {stats.plan_type.toUpperCase()}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">Exercícios</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {stats.exercises_used} / {stats.exercises_limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                exercisePercent > 90 ? 'bg-red-500' : exercisePercent > 70 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, exercisePercent)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700">Perguntas IA</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {stats.ai_questions_used} / {stats.ai_questions_limit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                aiPercent > 90 ? 'bg-red-500' : aiPercent > 70 ? 'bg-yellow-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(100, aiPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {isNearLimit && stats.plan_type === 'free' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-semibold text-yellow-900">Limite quase atingido!</p>
            </div>
            <p className="text-xs text-yellow-800 mb-3">
              Faça upgrade para continuar praticando sem limites
            </p>
            <Link
              href="/plans"
              className="block text-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Ver Planos Premium
            </Link>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4 text-center">
        Limites resetam à meia-noite
      </p>
    </div>
  );
}



