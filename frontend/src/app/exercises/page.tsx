'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ExerciseCard from '@/components/ExerciseCard';
import { exercisesAPI } from '@/lib/api';
import { Exercise, Subject, Difficulty } from '@/types';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');

  useEffect(() => {
    loadExercises();
  }, [selectedSubject, selectedDifficulty]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const response = await exercisesAPI.list({
        subject: selectedSubject || undefined,
        difficulty: selectedDifficulty || undefined,
      });
      setExercises(response.data);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (correct: boolean, xp: number) => {
    console.log(`Exercício ${correct ? 'correto' : 'incorreto'}. +${xp} XP`);
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
        <h1 className="text-3xl font-bold mb-8">Exercícios</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matéria
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                className="input-field text-gray-900"
              >
                <option value="">Todas</option>
                {Object.values(Subject).map((subject) => (
                  <option key={subject} value={subject} className="capitalize">
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificuldade
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
                className="input-field text-gray-900"
              >
                <option value="">Todas</option>
                {Object.values(Difficulty).map((difficulty) => (
                  <option key={difficulty} value={difficulty} className="capitalize">
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando exercícios...</p>
          </div>
        ) : exercises.length > 0 ? (
          <div className="space-y-6">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onComplete={handleComplete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Nenhum exercício encontrado com os filtros selecionados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

