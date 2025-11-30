'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Upload, Sparkles, Wand2, Crown, Lock } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function CreateExercisePage() {
  const [method, setMethod] = useState<'manual' | 'photo' | 'ai'>('manual');
  const [loading, setLoading] = useState(false);
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [exerciseLimits, setExerciseLimits] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
    ? `http://${hostname}:8000` 
    : 'http://localhost:8000';

  useEffect(() => {
    checkLimits();
  }, []);

  const checkLimits = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/usage/exercise-limits`);
      setExerciseLimits(response.data);
      setOcrEnabled(response.data.ocr_enabled);
    } catch (error) {
      console.error('Erro ao verificar limites:', error);
    }
  };
  
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    subject: 'matematica',
    difficulty: 'medio',
    type: 'multipla_escolha',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct_answer: 'a',
    explanation: '',
    source: ''
  });

  const [ocrResult, setOcrResult] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem!');
      return;
    }

    setLoading(true);
    setPhotoPreview(URL.createObjectURL(file));

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
          ? `http://${hostname}:8000` 
          : 'http://localhost:8000';
        
        const response = await axios.post(`${apiUrl}/api/v1/community/ocr`, {
          image_base64: base64
        });

        if (response.data.success) {
          setOcrResult(response.data);
          
          if (response.data.suggested_exercise) {
            const suggested = response.data.suggested_exercise;
            setFormData({
              title: suggested.title || '',
              question: suggested.question || response.data.extracted_text,
              subject: suggested.subject || 'matematica',
              difficulty: suggested.difficulty || 'medio',
              type: suggested.type || 'multipla_escolha',
              optionA: suggested.options?.a || '',
              optionB: suggested.options?.b || '',
              optionC: suggested.options?.c || '',
              optionD: suggested.options?.d || '',
              correct_answer: suggested.suggested_answer || 'a',
              explanation: suggested.explanation || '',
              source: 'photo'
            });
          }
        } else {
          alert('Erro ao processar imagem: ' + response.data.extracted_text);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erro ao processar imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.question || !formData.correct_answer) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    setLoading(true);
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
        ? `http://${hostname}:8000` 
        : 'http://localhost:8000';
      
      const options = formData.type === 'multipla_escolha' 
        ? JSON.stringify({
            a: formData.optionA,
            b: formData.optionB,
            c: formData.optionC,
            d: formData.optionD
          })
        : null;

      await axios.post(`${apiUrl}/api/v1/community/exercises?is_private=true`, {
        title: formData.title,
        question: formData.question,
        subject: formData.subject,
        difficulty: formData.difficulty,
        type: formData.type,
        options: options,
        correct_answer: formData.correct_answer,
        explanation: formData.explanation,
        source: formData.source || 'manual'
      });

      alert('✅ Exercício criado com sucesso e já disponível em "Meus Exercícios"!');
      
      setFormData({
        title: '',
        question: '',
        subject: 'matematica',
        difficulty: 'medio',
        type: 'multipla_escolha',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correct_answer: 'a',
        explanation: '',
        source: ''
      });
      setPhotoPreview('');
      setOcrResult(null);
      
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erro ao criar exercício');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Exercício</h1>
          <p className="text-gray-600 mb-4">Crie exercícios personalizados para seus estudos</p>
          
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-8">
            <p className="text-green-900 font-semibold mb-1">
              🔒 <strong>Privado & Instantâneo</strong>
            </p>
            <p className="text-sm text-green-800">
              Seus exercícios ficam <strong>privados</strong> (só você vê) e disponíveis <strong>imediatamente</strong> - sem aprovação necessária!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setMethod('manual')}
              className={`p-6 rounded-xl border-2 transition-all ${
                method === 'manual'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Wand2 className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-semibold text-gray-900">✍️ Manual</p>
              <p className="text-sm text-gray-600">Digite você mesmo</p>
            </button>

            <button
              onClick={() => ocrEnabled ? setMethod('photo') : null}
              disabled={!ocrEnabled}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                !ocrEnabled 
                  ? 'border-gray-200 bg-gray-50 opacity-75 cursor-not-allowed' 
                  : method === 'photo'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {!ocrEnabled && (
                <div className="absolute top-2 right-2">
                  <span className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </span>
                </div>
              )}
              {!ocrEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-5 rounded-xl">
                  <Lock className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <Camera className={`w-8 h-8 mx-auto mb-2 ${ocrEnabled ? 'text-purple-600' : 'text-gray-400'}`} />
              <p className={`font-semibold ${ocrEnabled ? 'text-gray-900' : 'text-gray-500'}`}>📸 Foto</p>
              <p className={`text-sm ${ocrEnabled ? 'text-gray-600' : 'text-gray-400'}`}>
                {ocrEnabled ? 'Tire/envie foto' : 'Requer Premium'}
              </p>
            </button>

            <button
              onClick={() => setMethod('ai')}
              className={`p-6 rounded-xl border-2 transition-all ${
                method === 'ai'
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <p className="font-semibold text-gray-900">🤖 IA</p>
              <p className="text-sm text-gray-600">Gerar com IA</p>
            </button>
          </div>

          {method === 'photo' && !ocrEnabled && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-12 text-center">
                <Lock className="w-20 h-20 text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  📸 OCR Disponível Apenas no Plano Premium
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Tire fotos de exercícios de livros, cadernos ou provas e nossa IA extrai o texto automaticamente! 
                  Economize tempo e crie exercícios muito mais rápido.
                </p>
                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="text-3xl mb-2">⚡</div>
                    <p className="text-sm font-semibold text-gray-900">Instantâneo</p>
                    <p className="text-xs text-gray-600">IA extrai em segundos</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="text-sm font-semibold text-gray-900">Preciso</p>
                    <p className="text-xs text-gray-600">Reconhece texto impresso</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="text-3xl mb-2">∞</div>
                    <p className="text-sm font-semibold text-gray-900">Ilimitado</p>
                    <p className="text-xs text-gray-600">Sem limites de uso</p>
                  </div>
                </div>
                <Link
                  href="/plans"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Crown className="w-5 h-5 inline mr-2" />
                  Fazer Upgrade para Premium
                </Link>
                <p className="text-sm text-gray-600 mt-4">
                  A partir de R$ 19,90/mês • Exercícios ilimitados • OCR ilimitado
                </p>
              </div>
            </div>
          )}

          {method === 'photo' && ocrEnabled && (
            <div className="mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 transition-all">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                {photoPreview ? (
                  <div>
                    <img src={photoPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                    >
                      Trocar Foto
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-700 font-semibold mb-2">
                      Clique ou arraste uma foto aqui
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Tire foto de um exercício de livro, caderno ou prova
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary"
                    >
                      <Camera className="w-5 h-5 inline mr-2" />
                      Selecionar Foto
                    </button>
                  </div>
                )}
              </div>

              {loading && (
                <div className="mt-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">🔍 Analisando foto com IA...</p>
                </div>
              )}

              {ocrResult && !loading && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                  <h3 className="font-bold text-green-900 mb-2">✅ Texto Extraído com Sucesso!</h3>
                  <p className="text-sm text-green-800 mb-4">
                    Revise os campos abaixo e ajuste se necessário:
                  </p>
                </div>
              )}
            </div>
          )}

          {method === 'ai' && (
            <div className="mb-8 p-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
              <Sparkles className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Gerar com IA
              </h3>
              <p className="text-center text-gray-700 mb-4">
                Use a página <strong>"Gerar Sessão de Estudos com IA"</strong> para criar exercícios automaticamente!
              </p>
              <div className="text-center">
                <Link href="/study-session" className="btn-primary inline-block">
                  Ir para Gerador IA →
                </Link>
              </div>
            </div>
          )}

          {(method === 'manual' || (method === 'photo' && ocrResult)) && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    📚 Matéria *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field text-gray-900"
                  >
                    {subjects.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    🎯 Dificuldade *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="input-field text-gray-900"
                  >
                    <option value="facil">Fácil</option>
                    <option value="medio">Médio</option>
                    <option value="dificil">Difícil</option>
                    <option value="desafio">Desafio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  📝 Título do Exercício *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field text-gray-900"
                  placeholder="Ex: Multiplicação de Frações"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  ❓ Pergunta/Enunciado *
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="input-field text-gray-900 min-h-[120px]"
                  placeholder="Digite a pergunta completa do exercício..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  📋 Tipo de Questão
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field text-gray-900"
                >
                  <option value="multipla_escolha">Múltipla Escolha</option>
                  <option value="verdadeiro_falso">Verdadeiro ou Falso</option>
                  <option value="dissertativa">Dissertativa</option>
                </select>
              </div>

              {formData.type === 'multipla_escolha' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    ✅ Opções de Resposta *
                  </label>
                  <input
                    type="text"
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="input-field text-gray-900"
                    placeholder="A) Primeira opção"
                  />
                  <input
                    type="text"
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="input-field text-gray-900"
                    placeholder="B) Segunda opção"
                  />
                  <input
                    type="text"
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="input-field text-gray-900"
                    placeholder="C) Terceira opção"
                  />
                  <input
                    type="text"
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="input-field text-gray-900"
                    placeholder="D) Quarta opção"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  ✔️ Resposta Correta *
                </label>
                {formData.type === 'multipla_escolha' ? (
                  <select
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    className="input-field text-gray-900"
                  >
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    className="input-field text-gray-900"
                    placeholder="Digite a resposta correta"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  💡 Explicação
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="input-field text-gray-900 min-h-[100px]"
                  placeholder="Explique por que essa é a resposta correta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  📖 Fonte (opcional)
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="input-field text-gray-900"
                  placeholder="Ex: Livro XYZ, Prova 2024, etc"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    ✨ Criar Exercício
                  </>
                )}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">ℹ️ Como funciona:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• ✅ Seus exercícios são <strong>privados</strong> (só você vê)</li>
                  <li>• ⚡ Ficam disponíveis <strong>imediatamente</strong></li>
                  <li>• 🔒 Sem aprovação necessária</li>
                  <li>• 📚 Acesse em "Meus Exercícios" a qualquer momento</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
          <h3 className="font-bold text-yellow-900 mb-3">💡 Dicas para criar bons exercícios:</h3>
          <ul className="text-yellow-800 space-y-2">
            <li>✅ Seja claro e objetivo na pergunta</li>
            <li>✅ Crie opções plausíveis (não muito óbvias)</li>
            <li>✅ Adicione explicação detalhada</li>
            <li>✅ Use fotos nítidas e bem iluminadas</li>
            <li>✅ Revise antes de enviar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

