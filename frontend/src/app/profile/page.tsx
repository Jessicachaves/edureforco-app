'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Calendar, Trophy, BookOpen, Target, Crown, Edit2, Save, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';

interface UserStats {
  total_exercises: number;
  exercises_correct: number;
  current_streak: number;
  total_points: number;
  level: number;
  exercises_by_subject: Record<string, number>;
}

function ProfileContent() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [bio, setBio] = useState('');
  const [availableGrades, setAvailableGrades] = useState<any[]>([]);
  
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
    ? `http://${hostname}:8000` 
    : 'http://localhost:8000';

  useEffect(() => {
    loadUserProfile();
    loadUserStats();
    loadGrades();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/profile/me`);
      const userData = response.data;
      setName(userData.name || '');
      setGrade(userData.grade || '');
      setBio(userData.bio || '');
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/progress/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/profile/grades`);
      setAvailableGrades(response.data.grades);
    } catch (error) {
      console.error('Erro ao carregar séries:', error);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Nome não pode estar vazio!');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${apiUrl}/api/v1/profile/me`, { 
        name,
        grade: grade || null,
        bio: bio || null
      });
      alert('✅ Perfil atualizado com sucesso!');
      setEditing(false);
      loadUserProfile(); // Recarrega os dados
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadUserProfile(); // Restaura dados originais
    setEditing(false);
  };

  const accuracy = stats && stats.total_exercises > 0 
    ? Math.round((stats.exercises_correct / stats.total_exercises) * 100)
    : 0;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              
              {editing ? (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field text-gray-900 w-full"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Série/Ano Escolar
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="input-field text-gray-900 w-full"
                    >
                      <option value="">Selecione sua série</option>
                      {availableGrades.map((g: any) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sobre você (Bio)
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="input-field text-gray-900 w-full min-h-[80px] resize-none"
                      placeholder="Conte um pouco sobre você e seus objetivos de estudo..."
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {bio.length}/200 caracteres
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Salvar
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{name || user?.name}</h2>
                  
                  {grade && (
                    <p className="text-sm font-semibold text-primary-600 mb-2">
                      {availableGrades.find(g => g.value === grade)?.label || grade}
                    </p>
                  )}
                  
                  <p className="text-gray-600 mb-2">{user?.email}</p>
                  
                  {bio && (
                    <p className="text-sm text-gray-600 italic mb-4 px-4">
                      "{bio}"
                    </p>
                  )}
                  
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar Perfil
                  </button>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <span className="text-3xl font-bold text-gray-900">
                    Nível {stats?.level || 1}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Trophy className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold">{stats?.total_points || 0} XP</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm break-all">{user?.email}</span>
                </div>
                {grade && !editing && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">
                      {availableGrades.find(g => g.value === grade)?.label || grade}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Membro desde {new Date(user?.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <Link 
              href="/plans"
              className="mt-6 block bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Plano Free</h3>
                  <p className="text-sm opacity-90">Upgrade para Premium</p>
                </div>
                <Crown className="w-8 h-8" />
              </div>
            </Link>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Estatísticas</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-primary-100 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 font-semibold mb-1">Total de Exercícios</p>
                      <p className="text-4xl font-bold text-primary-600">{stats?.total_exercises || 0}</p>
                    </div>
                    <BookOpen className="w-12 h-12 text-primary-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 font-semibold mb-1">Taxa de Acerto</p>
                      <p className="text-4xl font-bold text-green-600">{accuracy}%</p>
                    </div>
                    <Target className="w-12 h-12 text-green-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-xl p-6 border-2 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 font-semibold mb-1">Sequência Atual</p>
                      <p className="text-4xl font-bold text-orange-600">{stats?.current_streak || 0} dias</p>
                    </div>
                    <div className="text-4xl">🔥</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 font-semibold mb-1">Exercícios Corretos</p>
                      <p className="text-4xl font-bold text-purple-600">{stats?.exercises_correct || 0}</p>
                    </div>
                    <Trophy className="w-12 h-12 text-purple-600 opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Exercícios por Matéria</h2>
              
              {stats?.exercises_by_subject && Object.keys(stats.exercises_by_subject).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(stats.exercises_by_subject)
                    .sort((a, b) => b[1] - a[1])
                    .map(([subject, count]) => (
                      <div key={subject} className="flex items-center gap-4">
                        <div className="w-32 font-semibold text-gray-700">
                          {subjectLabels[subject] || subject}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-purple-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (count / (stats?.total_exercises || 1)) * 100)}%` }}
                          />
                        </div>
                        <div className="w-16 text-right font-bold text-gray-900">{count}</div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Ainda não há dados de exercícios por matéria.</p>
                  <Link href="/exercises" className="text-primary-600 hover:underline font-semibold mt-2 inline-block">
                    Começar a praticar →
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">🎯 Próxima Meta</h2>
              <p className="mb-6 opacity-90">
                Continue praticando para alcançar o Nível {(stats?.level || 1) + 1}!
              </p>
              <div className="bg-white bg-opacity-20 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${((stats?.total_points || 0) % 1000) / 10}%` }}
                />
              </div>
              <p className="mt-2 text-sm opacity-90">
                {stats?.total_points || 0} / {((Math.floor((stats?.total_points || 0) / 1000) + 1) * 1000)} XP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
