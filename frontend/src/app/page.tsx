'use client';

import Link from 'next/link';
import { BookOpen, Brain, Trophy, Users, Zap, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">EduReforço</h1>
            </div>
            <div className="flex gap-3 items-center">
              <Link 
                href="/plans" 
                className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-all"
              >
                💎 Planos
              </Link>
              <Link 
                href="/login" 
                className="px-6 py-2.5 text-primary-600 font-semibold border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-all"
              >
                Entrar
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Começar Grátis ✨
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Aprenda de forma <span className="text-primary-600">inteligente</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Reforço escolar personalizado com IA, gamificação e acompanhamento em tempo real
          </p>
          <Link 
            href="/register" 
            className="inline-block px-10 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300"
          >
            🚀 Comece sua jornada agora
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <Brain className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Tutor com IA</h3>
            <p className="text-gray-600">
              Tire dúvidas instantaneamente com nosso tutor inteligente disponível 24/7
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Gamificação</h3>
            <p className="text-gray-600">
              Ganhe pontos, badges e suba no ranking enquanto aprende
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <Target className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Adaptativo</h3>
            <p className="text-gray-600">
              Exercícios que se adaptam ao seu nível e ritmo de aprendizado
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <Zap className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Microlearning</h3>
            <p className="text-gray-600">
              Aprenda em pequenas doses, perfeito para rotinas ocupadas
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <Users className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Acompanhamento</h3>
            <p className="text-gray-600">
              Pais e professores podem monitorar o progresso em tempo real
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <BookOpen className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Todas as Matérias</h3>
            <p className="text-gray-600">
              Matemática, Português, Ciências e muito mais em um só lugar
            </p>
          </div>
        </div>

        <div className="bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Pronto para revolucionar seus estudos?</h3>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de estudantes que já estão aprendendo melhor
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/register" 
              className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 inline-block"
            >
              ⚡ Criar Conta Gratuita
            </Link>
            <Link 
              href="/plans" 
              className="bg-transparent border-3 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all duration-300 inline-block"
            >
              💎 Ver Planos
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 EduReforço. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

