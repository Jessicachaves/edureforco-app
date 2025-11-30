'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import Link from 'next/link';
import { gamificationAPI } from '@/lib/api';

interface LeaderboardEntry {
  position: number;
  name: string;
  level: number;
  xp: number;
  streak_days: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await gamificationAPI.leaderboard(20);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (position: number) => {
    if (position === 1) return 'text-yellow-500';
    if (position === 2) return 'text-gray-400';
    if (position === 3) return 'text-amber-700';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <div>
              <h1 className="text-3xl font-bold">Ranking Global</h1>
              <p className="text-gray-600">Veja os melhores estudantes da plataforma</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando ranking...</p>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.position}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    entry.position <= 3
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-center">
                      {entry.position <= 3 ? (
                        <Medal className={`w-8 h-8 ${getMedalColor(entry.position)}`} />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {entry.position}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{entry.name}</p>
                      <p className="text-sm text-gray-600">Nível {entry.level}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{entry.xp} XP</p>
                      <p className="text-sm text-gray-600">{entry.streak_days} dias seguidos</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum dado de ranking disponível</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">🎯 Como subir no ranking?</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Complete exercícios diariamente</li>
            <li>• Mantenha sua sequência de dias</li>
            <li>• Acerte mais questões para ganhar mais XP</li>
            <li>• Participe de desafios especiais</li>
          </ul>
        </div>
      </div>
    </div>
  );
}




