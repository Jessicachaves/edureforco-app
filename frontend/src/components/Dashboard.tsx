'use client';

import { useEffect, useState } from 'react';
import { Trophy, Target, Flame, TrendingUp, BookOpen, Award } from 'lucide-react';
import { progressAPI } from '@/lib/api';
import { DashboardStats } from '@/types';
import UsageLimits from './UsageLimits';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await progressAPI.dashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12">Erro ao carregar dados</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.level}</span>
          </div>
          <p className="text-sm opacity-90">Nível Atual</p>
          <div className="mt-2 bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.total_xp}</span>
          </div>
          <p className="text-sm opacity-90">Total XP</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.streak_days}</span>
          </div>
          <p className="text-sm opacity-90">Dias Seguidos</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.accuracy.toFixed(0)}%</span>
          </div>
          <p className="text-sm opacity-90">Precisão</p>
        </div>
      </div>

      <UsageLimits />

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-600" />
          Progresso por Matéria
        </h3>
        <div className="space-y-4">
          {stats.subjects_progress.map((progress) => (
            <div key={progress.id}>
              <div className="flex justify-between mb-2">
                <span className="font-medium capitalize">{progress.subject}</span>
                <span className="text-gray-600">
                  {progress.correct_exercises}/{progress.total_exercises} corretos
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 rounded-full h-3 transition-all"
                  style={{ width: `${progress.accuracy}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Conquistas Recentes
        </h3>
        {stats.recent_badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.recent_badges.map((badge) => (
              <div key={badge.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-semibold text-sm">{badge.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhuma conquista ainda. Continue estudando!</p>
        )}
      </div>
    </div>
  );
}

