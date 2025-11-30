'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Eye } from 'lucide-react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

interface CommunityExercise {
  id: number;
  title: string;
  question: string;
  subject: string;
  difficulty: string;
  type: string;
  is_approved: boolean;
  is_public: boolean;
  upvotes: number;
  downvotes: number;
  times_used: number;
  creator_name?: string;
  created_at: string;
  options?: string;
  correct_answer: string;
  explanation?: string;
}

function ModerationContent() {
  const [exercises, setExercises] = useState<CommunityExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<CommunityExercise | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
    ? `http://${hostname}:8000` 
    : 'http://localhost:8000';

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/permissions/check-admin`);
      setIsAdmin(response.data.is_admin);
      if (response.data.is_admin) {
        loadExercises();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/community/exercises?approved_only=false`);
      setExercises(response.data);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (exerciseId: number) => {
    try {
      await axios.post(`${apiUrl}/api/v1/community/exercises/${exerciseId}/approve`);
      alert('✅ Exercício aprovado!');
      loadExercises();
      setSelectedExercise(null);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erro ao aprovar exercício');
    }
  };

  const handleReject = async (exerciseId: number) => {
    const confirm = window.confirm('Tem certeza que deseja rejeitar este exercício?');
    if (!confirm) return;
    
    alert('⚠️ Função de rejeição não implementada ainda. Por enquanto, apenas não aprove.');
  };

  const parseOptions = (options: string | undefined) => {
    if (!options) return null;
    try {
      return JSON.parse(options);
    } catch {
      return null;
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

  const typeLabels: Record<string, string> = {
    multipla_escolha: 'Múltipla Escolha',
    verdadeiro_falso: 'Verdadeiro ou Falso',
    dissertativa: 'Dissertativa',
    completar: 'Completar',
  };

  const pendingExercises = exercises.filter(ex => !ex.is_approved);
  const approvedExercises = exercises.filter(ex => ex.is_approved);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
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
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-12 text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-red-900 mb-4">Acesso Negado</h1>
            <p className="text-red-700 mb-6">
              Apenas <strong>administradores</strong> e <strong>professores</strong> podem acessar o painel de moderação.
            </p>
            <Link 
              href="/dashboard"
              className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
            >
              Voltar ao Dashboard
            </Link>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-300 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-3">💡 Você é professor ou administrador?</h3>
            <p className="text-blue-800 mb-4">
              Entre em contato com o suporte para solicitar permissões de moderação.
            </p>
            <p className="text-sm text-blue-700">
              📧 Email: <strong>suporte@edureforco.com</strong>
            </p>
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moderação de Exercícios</h1>
          <p className="text-gray-600">Aprove ou rejeite exercícios criados pela comunidade</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-yellow-900 mb-2">
              {pendingExercises.length}
            </h3>
            <p className="text-yellow-700 font-semibold">⏳ Pendentes de Aprovação</p>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              {approvedExercises.length}
            </h3>
            <p className="text-green-700 font-semibold">✅ Aprovados</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              {exercises.length}
            </h3>
            <p className="text-blue-700 font-semibold">📊 Total</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ⏳ Aguardando Aprovação ({pendingExercises.length})
            </h2>
            
            {pendingExercises.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <p className="text-gray-600">✅ Nenhum exercício pendente!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingExercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{exercise.title}</h3>
                        <p className="text-sm text-gray-600">
                          Por: {exercise.creator_name || 'Anônimo'} • {new Date(exercise.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {subjectLabels[exercise.subject]}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {difficultyLabels[exercise.difficulty]}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{exercise.question.substring(0, 150)}...</p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedExercise(exercise)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => handleApprove(exercise.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(exercise.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {selectedExercise ? (
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Detalhes do Exercício</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Título:</label>
                    <p className="text-gray-900 font-medium">{selectedExercise.title}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">Pergunta:</label>
                    <p className="text-gray-900">{selectedExercise.question}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Matéria:</label>
                      <p className="text-gray-900">{subjectLabels[selectedExercise.subject]}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Dificuldade:</label>
                      <p className="text-gray-900">{difficultyLabels[selectedExercise.difficulty]}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Tipo:</label>
                      <p className="text-gray-900">{typeLabels[selectedExercise.type]}</p>
                    </div>
                  </div>

                  {selectedExercise.type === 'multipla_escolha' && selectedExercise.options && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Opções:</label>
                      {Object.entries(parseOptions(selectedExercise.options) || {}).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2 mb-2">
                          <span className="font-bold text-gray-700">{key.toUpperCase()})</span>
                          <span className="text-gray-900">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-gray-700">Resposta Correta:</label>
                    <p className="text-green-700 font-bold">{selectedExercise.correct_answer.toUpperCase()}</p>
                  </div>

                  {selectedExercise.explanation && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Explicação:</label>
                      <p className="text-gray-900">{selectedExercise.explanation}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">👤 Criador:</span>
                      <span className="text-gray-900 font-semibold">{selectedExercise.creator_name || 'Anônimo'}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">📅 Criado em:</span>
                      <span className="text-gray-900">{new Date(selectedExercise.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {!selectedExercise.is_approved && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleApprove(selectedExercise.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(selectedExercise.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        <XCircle className="w-5 h-5" />
                        Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-12 text-center">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecione um exercício para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Exercícios Aprovados ({approvedExercises.length})
          </h2>
          
          {approvedExercises.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Nenhum exercício aprovado ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedExercises.map((exercise) => (
                <div key={exercise.id} className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{exercise.title}</h3>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{subjectLabels[exercise.subject]}</span>
                    <span>{difficultyLabels[exercise.difficulty]}</span>
                  </div>
                  <div className="mt-3 flex gap-4 text-sm">
                    <span className="text-green-700">👍 {exercise.upvotes}</span>
                    <span className="text-gray-600">🔁 {exercise.times_used} usos</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ModerationPage() {
  return (
    <ProtectedRoute>
      <ModerationContent />
    </ProtectedRoute>
  );
}

