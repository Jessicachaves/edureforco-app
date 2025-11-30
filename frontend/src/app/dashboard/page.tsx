'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Home, Trophy, User, MessageSquare, LogOut, Plus, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';

function DashboardContent() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
    ? `http://${hostname}:8000` 
    : 'http://localhost:8000';

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/permissions/check-admin`);
      setIsAdmin(response.data.is_admin);
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">EduReforço</h1>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-gray-700">Olá, {user?.name || 'Estudante'}</span>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'home' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Início</span>
              </button>

              <Link
                href="/exercises"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Exercícios</span>
              </Link>

              <Link
                href="/study-session"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>✨ Gerar com IA</span>
              </Link>

              <Link
                href="/my-exercises"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>📚 Meus Exercícios</span>
              </Link>

              <Link
                href="/create-exercise"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>➕ Criar Exercício</span>
              </Link>

              <Link
                href="/leaderboard"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Trophy className="w-5 h-5" />
                <span>Ranking</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/moderation"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>🛡️ Moderação</span>
                </Link>
              )}

              <Link
                href="/ai-tutor"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Tutor IA</span>
              </Link>

              <Link
                href="/plans"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Trophy className="w-5 h-5" />
                <span>Planos</span>
              </Link>

              <Link
                href="/profile"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </Link>
            </div>
          </div>

          <div className="md:col-span-4">
            {activeTab === 'home' && <Dashboard />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

