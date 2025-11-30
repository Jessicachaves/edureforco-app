'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Trash2, Eye, Calendar } from 'lucide-react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import ExerciseLimitsBadge from '@/components/ExerciseLimitsBadge';

interface MyExercise {
  id: number;
  title: string;
  question: string;
  subject: string;
  difficulty: string;
  type: string;
  is_private: boolean;
  created_at: string;
  times_used: number;
}

function MyExercisesContent() {
  const [exercises, setExercises] = useState<MyExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<MyExercise | null>(null);

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
    ? `http://${hostname}:8000` 
    : 'http://localhost:8000';

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/community/my-exercises?only_private=true`);
      setExercises(response.data);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  const subjectLabels: Record<string, string> = {
    matematica: 'Matemática',
    portugues: 'Português',
    ciencias: 'Ciências',
    historia: 'História',
    geografia: 'Geografia',
    ingles: 'Inglês',
    fisica: 'Física',
    quimica: 'Química',
    biologia: 'Biologia',
  };

  const difficultyLabels: Record<string, string> = {
    facil: 'Fácil',
    medio: 'Médio',
    dificil: 'Difícil',
    desafio: 'Desafio',
  };

  const difficultyColors: Record<string, string> = {
    facil: 'bg-green-100 text-green-800',
    medio: 'bg-yellow-100 text-yellow-800',
    dificil: 'bg-orange-100 text-orange-800',
    desafio: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus exercícios...</p>
        </div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Exercícios</h1>
              <p className="text-gray-600">Exercícios que você criou para estudar</p>
            </div>
            <Link
              href="/create-exercise"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              ➕ Criar Novo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              {exercises.length}
            </h3>
            <p className="text-blue-700 font-semibold">📚 Total de Exercícios</p>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              {exercises.reduce((sum, ex) => sum + ex.times_used, 0)}
            </h3>
            <p className="text-green-700 font-semibold">🔄 Vezes Praticadas</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-purple-900 mb-2">
              100%
            </h3>
            <p className="text-purple-700 font-semibold">🔒 Privados (só você vê)</p>
          </div>
        </div>

        <div className="mb-8">
          <ExerciseLimitsBadge />
        </div>

        {exercises.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhum exercício ainda
            </h3>
            <p className="text-gray-600 mb-8">
              Crie exercícios personalizados para seus estudos! Você pode:
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-4xl mb-3">✍️</div>
                <h4 className="font-bold text-gray-900 mb-2">Digitar</h4>
                <p className="text-sm text-gray-700">Escreva suas próprias perguntas</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-4xl mb-3">📸</div>
                <h4 className="font-bold text-gray-900 mb-2">Fotografar</h4>
                <p className="text-sm text-gray-700">Tire foto de exercícios</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-6">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="font-bold text-gray-900 mb-2">IA</h4>
                <p className="text-sm text-gray-700">Gere com inteligência artificial</p>
              </div>
            </div>
            <Link
              href="/create-exercise"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              🚀 Criar Meu Primeiro Exercício
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-gray-100 hover:border-primary-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {exercise.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                        {subjectLabels[exercise.subject]}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${difficultyColors[exercise.difficulty]}`}>
                        {difficultyLabels[exercise.difficulty]}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {exercise.question}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(exercise.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {exercise.times_used} usos
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedExercise(exercise)}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-sm transition-all"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedExercise.title}
                </h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Pergunta:</label>
                  <p className="text-gray-900 mt-1">{selectedExercise.question}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Matéria:</label>
                    <p className="text-gray-900">{subjectLabels[selectedExercise.subject]}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Dificuldade:</label>
                    <p className="text-gray-900">{difficultyLabels[selectedExercise.difficulty]}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Dica:</strong> Use este exercício para praticar quando quiser!
                  </p>
                </div>

                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyExercisesPage() {
  return (
    <ProtectedRoute>
      <MyExercisesContent />
    </ProtectedRoute>
  );
}

