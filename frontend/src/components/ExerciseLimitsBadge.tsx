'use client';

import { useState, useEffect } from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

interface ExerciseLimits {
  private_exercises_used: number;
  private_exercises_limit: number;
  ocr_enabled: boolean;
  plan_type: string;
  unlimited: boolean;
}

export default function ExerciseLimitsBadge() {
  const [limits, setLimits] = useState<ExerciseLimits | null>(null);
  const [loading, setLoading] = useState(true);

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
    ? `http://${hostname}:8000` 
    : 'http://localhost:8000';

  useEffect(() => {
    loadLimits();
  }, []);

  const loadLimits = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/usage/exercise-limits`);
      setLimits(response.data);
    } catch (error) {
      console.error('Erro ao carregar limites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !limits) return null;

  const percentage = limits.unlimited 
    ? 100 
    : (limits.private_exercises_used / limits.private_exercises_limit) * 100;
  
  const isNearLimit = percentage >= 60 && !limits.unlimited;
  const isAtLimit = limits.private_exercises_used >= limits.private_exercises_limit && !limits.unlimited;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Exercícios Privados</h3>
        {limits.plan_type !== 'free' && (
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            limits.plan_type === 'premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
            limits.plan_type === 'enterprise' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
            'bg-blue-100 text-blue-800'
          }`}>
            {limits.plan_type.toUpperCase()}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Contador */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">Criados este mês:</span>
            <span className={`text-lg font-bold ${
              isAtLimit ? 'text-red-600' : 
              isNearLimit ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {limits.unlimited ? '∞ Ilimitado' : `${limits.private_exercises_used} / ${limits.private_exercises_limit}`}
            </span>
          </div>
          
          {!limits.unlimited && (
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  isAtLimit ? 'bg-red-500' : 
                  isNearLimit ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          )}
        </div>

        {/* Avisos */}
        {isAtLimit && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900 mb-1">Limite Atingido!</p>
                <p className="text-sm text-red-800 mb-3">
                  Você já criou {limits.private_exercises_limit} exercícios este mês. 
                  Upgrade para Premium e crie ilimitados!
                </p>
                <Link
                  href="/plans"
                  className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-all"
                >
                  Ver Planos Premium
                </Link>
              </div>
            </div>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-yellow-900 mb-1">Quase no Limite!</p>
                <p className="text-sm text-yellow-800">
                  Você já usou {limits.private_exercises_used} de {limits.private_exercises_limit} exercícios este mês.
                </p>
              </div>
            </div>
          </div>
        )}

        {limits.plan_type === 'free' && !isAtLimit && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-purple-900 mb-1">💎 Upgrade para Premium</p>
                <p className="text-sm text-purple-800 mb-3">
                  Exercícios privados <strong>ilimitados</strong> + 📸 OCR de fotos!
                </p>
                <Link
                  href="/plans"
                  className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Começar Agora
                </Link>
              </div>
            </div>
          </div>
        )}

        {limits.unlimited && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
            <p className="text-green-900 font-semibold text-center">
              ✨ Você tem exercícios ilimitados! 🎉
            </p>
          </div>
        )}

        {/* Info sobre OCR */}
        {!limits.ocr_enabled && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">📸 OCR (Foto → Texto)</p>
                <p className="text-xs text-gray-600">Tire fotos e crie exercícios automaticamente</p>
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                PREMIUM
              </span>
            </div>
          </div>
        )}

        {limits.ocr_enabled && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold">📸 OCR Ativo - Tire fotos à vontade!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

