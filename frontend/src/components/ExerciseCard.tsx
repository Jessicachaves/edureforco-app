'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Exercise } from '@/types';
import { exercisesAPI } from '@/lib/api';

interface Props {
  exercise: Exercise;
  onComplete: (correct: boolean, xp: number) => void;
}

export default function ExerciseCard({ exercise, onComplete }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    try {
      const response = await exercisesAPI.check({
        exercise_id: exercise.id,
        user_answer: selectedAnswer,
      });

      setResult(response.data);
      setSubmitted(true);
      onComplete(response.data.is_correct, response.data.xp_earned);
    } catch (error) {
      console.error('Erro ao verificar resposta:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">{exercise.title}</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
              {exercise.subject}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm capitalize">
              {exercise.difficulty}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              +{exercise.xp_reward} XP
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-900 text-lg mb-4 font-medium">{exercise.question}</p>
      </div>

      {exercise.options && !submitted && (
        <div className="space-y-3 mb-6">
          {Object.entries(exercise.options).map(([key, value]) => (
            <label
              key={key}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAnswer === key
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={key}
                checked={selectedAnswer === key}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="w-5 h-5 text-primary-600"
              />
              <span className="ml-3 font-medium text-gray-900">{key.toUpperCase()})</span>
              <span className="ml-2 text-gray-900">{value}</span>
            </label>
          ))}
        </div>
      )}

      {!submitted && (
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Responder
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="btn-secondary"
          >
            <Lightbulb className="w-5 h-5" />
          </button>
        </div>
      )}

      {showHint && exercise.hints && exercise.hints.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">💡 {exercise.hints[0]}</p>
        </div>
      )}

      {submitted && result && (
        <div className={`p-6 rounded-lg ${result.is_correct ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            {result.is_correct ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
            <div>
              <h4 className={`text-xl font-bold ${result.is_correct ? 'text-green-800' : 'text-red-800'}`}>
                {result.is_correct ? 'Parabéns! Resposta correta!' : 'Ops! Resposta incorreta'}
              </h4>
              <p className="text-sm text-gray-900 font-semibold">+{result.xp_earned} XP</p>
            </div>
          </div>

          <div className="space-y-3">
            {!result.is_correct && (
              <div>
                <p className="font-semibold text-gray-900">Resposta correta:</p>
                <p className="text-gray-900 font-medium">{result.correct_answer}</p>
              </div>
            )}

            <div>
              <p className="font-semibold text-gray-900">Explicação:</p>
              <p className="text-gray-900">{result.explanation}</p>
            </div>

            {result.ai_feedback && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-800 mb-2">💬 Feedback do Tutor:</p>
                <p className="text-blue-900">{result.ai_feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

