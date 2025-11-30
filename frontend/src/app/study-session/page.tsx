'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { aiAPI } from '@/lib/api';
import ExerciseCard from '@/components/ExerciseCard';
import axios from 'axios';

export default function StudySessionPage() {
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [subject, setSubject] = useState('matematica');
  const [difficulty, setDifficulty] = useState('medio');
  const [topic, setTopic] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [userGrade, setUserGrade] = useState<string>('');

  const subjects = [
    { value: 'matematica', label: 'Matemática' },
    { value: 'portugues', label: 'Português' },
    { value: 'ciencias', label: 'Ciências' },
    { value: 'historia', label: 'História' },
    { value: 'geografia', label: 'Geografia' },
    { value: 'ingles', label: 'Inglês' },
    { value: 'fisica', label: 'Física' },
    { value: 'quimica', label: 'Química' },
    { value: 'biologia', label: 'Biologia' },
  ];

  const difficulties = [
    { value: 'facil', label: 'Fácil', color: 'bg-green-100 text-green-800' },
    { value: 'medio', label: 'Médio', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'dificil', label: 'Difícil', color: 'bg-orange-100 text-orange-800' },
    { value: 'desafio', label: 'Desafio', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
        ? `http://${hostname}:8000` 
        : 'http://localhost:8000';
      
      const response = await axios.get(`${apiUrl}/api/v1/profile/me`);
      const grade = response.data.grade;
      setUserGrade(grade);
      
      if (grade) {
        if (grade.includes('1ano-fundamental') || grade.includes('2ano-fundamental') || 
            grade.includes('3ano-fundamental') || grade.includes('4ano-fundamental')) {
          setDifficulty('facil');
        } else if (grade.includes('5ano-fundamental') || grade.includes('6ano-fundamental') || 
                   grade.includes('7ano-fundamental')) {
          setDifficulty('medio');
        } else if (grade.includes('8ano-fundamental') || grade.includes('9ano-fundamental') || 
                   grade.includes('1ano-medio') || grade.includes('2ano-medio')) {
          setDifficulty('dificil');
        } else if (grade.includes('3ano-medio') || grade.includes('pre-vestibular')) {
          setDifficulty('desafio');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Por favor, digite um tópico!');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.generateExercise({
        subject,
        difficulty,
        topic: topic.trim(),
        quantity
      });

      if (response.data.exercises && response.data.exercises.length > 0) {
        const formattedExercises = response.data.exercises.map((ex: any, idx: number) => ({
          id: idx + 1000,
          title: ex.title,
          question: ex.question,
          subject,
          difficulty,
          type: 'multipla_escolha',
          options: ex.options,
          xp_reward: difficulty === 'facil' ? 10 : difficulty === 'medio' ? 15 : difficulty === 'dificil' ? 20 : 25,
          explanation: ex.explanation,
          hints: [],
          created_at: new Date().toISOString()
        }));
        
        setExercises(formattedExercises);
        setCurrentExercise(0);
        setTotalXp(0);
      } else {
        alert('Não foi possível gerar exercícios. Tente novamente!');
      }
    } catch (error: any) {
      console.error('Erro ao gerar exercícios:', error);
      alert(error.response?.data?.detail || 'Erro ao gerar exercícios com IA');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (correct: boolean, xp: number) => {
    setTotalXp(prev => prev + xp);
    
    if (currentExercise < exercises.length - 1) {
      setTimeout(() => {
        setCurrentExercise(prev => prev + 1);
      }, 3000);
    }
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
        {exercises.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-10 h-10 text-purple-600" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Gerar Sessão de Estudos com IA</h1>
                <p className="text-gray-600">Crie exercícios personalizados instantaneamente</p>
              </div>
              {userGrade && !loadingProfile && (
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-blue-700 font-semibold">📚 Dificuldade ajustada para sua série</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  📚 Matéria
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field text-gray-900"
                >
                  {subjects.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  🎯 Nível de Dificuldade
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {difficulties.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`p-4 rounded-lg font-semibold transition-all ${
                        difficulty === d.value
                          ? `${d.color} ring-2 ring-offset-2 ring-purple-500`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  💡 Tópico / Assunto
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: frações, verbos, fotossíntese..."
                  className="input-field text-gray-900"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Seja específico para melhores resultados
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  🔢 Quantidade de Exercícios
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-4xl font-bold text-purple-600 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="text-gray-600">
                    (máx: 10)
                  </span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transform transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-size-200 bg-pos-0 hover:bg-pos-100"
                style={{
                  backgroundSize: '200% auto'
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-7 w-7 border-b-3 border-white"></div>
                    ✨ Gerando exercícios mágicos...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-7 h-7 animate-pulse" />
                    🪄 Gerar {quantity} Exercício{quantity > 1 ? 's' : ''} com IA
                  </>
                )}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">💡 Dicas:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Quanto mais específico o tópico, melhores os exercícios</li>
                  <li>• Comece com poucos exercícios para testar</li>
                  <li>• A IA gera questões únicas a cada vez</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Exercício {currentExercise + 1} de {exercises.length}
                  </h2>
                  <p className="text-gray-600">XP Total: {totalXp} pontos</p>
                </div>
                <button
                  onClick={() => setExercises([])}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Gerar Novos Exercícios
                </button>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {exercises[currentExercise] && (
              <ExerciseCard
                key={currentExercise}
                exercise={exercises[currentExercise]}
                onComplete={handleComplete}
              />
            )}

            {currentExercise === exercises.length - 1 && totalXp > 0 && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-8 text-white text-center">
                <h3 className="text-3xl font-bold mb-2">🎉 Parabéns!</h3>
                <p className="text-xl mb-4">Você completou a sessão!</p>
                <p className="text-2xl font-bold">Total: {totalXp} XP</p>
                <button
                  onClick={() => setExercises([])}
                  className="mt-6 bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-110 transform transition-all duration-300"
                >
                  ✨ Criar Nova Sessão
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

