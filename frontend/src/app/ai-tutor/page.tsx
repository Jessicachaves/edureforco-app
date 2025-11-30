'use client';

import { useState } from 'react';
import { ArrowLeft, Send, Brain } from 'lucide-react';
import Link from 'next/link';
import { aiAPI } from '@/lib/api';

export default function AITutorPage() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('matematica');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await aiAPI.ask({ question, subject });
      setResponse(result.data.answer);
    } catch (error) {
      setResponse('Erro ao obter resposta. Verifique se a API está configurada.');
    } finally {
      setLoading(false);
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
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-10 h-10 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold">Tutor com IA</h1>
              <p className="text-gray-600">Faça suas perguntas e receba explicações personalizadas</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matéria
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field text-gray-900"
              >
                <option value="matematica">Matemática</option>
                <option value="portugues">Português</option>
                <option value="ciencias">Ciências</option>
                <option value="historia">História</option>
                <option value="geografia">Geografia</option>
                <option value="fisica">Física</option>
                <option value="quimica">Química</option>
                <option value="biologia">Biologia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sua Pergunta
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-field text-gray-900 min-h-[120px]"
                placeholder="Ex: Como resolver equações de segundo grau?"
              />
            </div>

            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Pensando...'
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Perguntar ao Tutor
                </>
              )}
            </button>

            {response && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-primary-200">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-primary-600" />
                  Resposta do Tutor:
                </h3>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-bold mb-4">💡 Dicas para perguntas melhores:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Seja específico sobre o que você não entendeu</li>
              <li>• Forneça contexto se necessário</li>
              <li>• Peça exemplos práticos quando ajudar</li>
              <li>• Não tenha vergonha de perguntar o básico!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

