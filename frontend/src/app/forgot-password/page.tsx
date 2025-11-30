'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { BookOpen } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // TODO: Implementar lógica real de recuperação
    // Por enquanto, apenas simulação
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Enviado!</h2>
          <p className="text-gray-600 mb-8">
            Se existe uma conta com o email <strong>{email}</strong>, você receberá instruções para redefinir sua senha.
          </p>
          
          <Link
            href="/login"
            className="inline-block w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Voltar para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>

        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="w-10 h-10 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">EduReforço</h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Esqueceu sua senha?</h2>
        <p className="text-gray-600 text-center mb-8">
          Não se preocupe! Digite seu email e enviaremos instruções para redefinir sua senha.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-gray-900 pl-11"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? '📧 Enviando...' : '📧 Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Lembrou sua senha?{' '}
            <Link href="/login" className="text-primary-600 hover:underline font-semibold">
              Faça login
            </Link>
          </p>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">⚠️ Recurso em Desenvolvimento</h3>
          <p className="text-sm text-blue-800">
            A funcionalidade de recuperação de senha ainda está sendo implementada. 
            Por enquanto, entre em contato com o suporte: <strong>suporte@edureforco.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}




