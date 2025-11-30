'use client';

import { useState, useEffect } from 'react';
import { Check, Crown, Zap, Building } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

interface Plan {
  id: number;
  name: string;
  type: string;
  price_monthly: number;
  price_yearly: number;
  description: string;
  features: string;
  ad_free: boolean;
  max_exercises_per_day: number;
  max_ai_questions_per_day: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const apiUrl = hostname !== 'localhost' && hostname !== '127.0.0.1' 
        ? `http://${hostname}:8000` 
        : 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/api/v1/subscriptions/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'free': return '🎓';
      case 'basic': return <Zap className="w-8 h-8 text-blue-500" />;
      case 'premium': return <Crown className="w-8 h-8 text-yellow-500" />;
      case 'enterprise': return <Building className="w-8 h-8 text-purple-500" />;
      default: return '📚';
    }
  };

  const getPrice = (plan: Plan) => {
    const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
    if (price === 0) return 'Grátis';
    return billingCycle === 'monthly' 
      ? `R$ ${price.toFixed(2)}/mês`
      : `R$ ${price.toFixed(2)}/ano`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o plano perfeito para você
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Acelere seus estudos com as melhores ferramentas
          </p>

          <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-white">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Anual <span className="text-green-600 font-semibold">(Economize 17%)</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-xl p-8 card-hover ${
                plan.type === 'premium' ? 'border-4 border-yellow-400 relative' : ''
              }`}
            >
              {plan.type === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {getIcon(plan.type)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {getPrice(plan)}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.split('|').map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.type === 'premium'
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                    : plan.type === 'free'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {plan.price_monthly === 0 ? 'Começar Grátis' : 'Assinar Agora'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            ← Voltar ao Dashboard
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Perguntas Frequentes
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-gray-700">Sim! Cancele quando quiser, sem multas ou taxas.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Como funciona o período de teste?</h4>
              <p className="text-gray-700">7 dias grátis em qualquer plano pago!</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Quais formas de pagamento?</h4>
              <p className="text-gray-700">Cartão de crédito, boleto e PIX.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Funciona no celular?</h4>
              <p className="text-gray-700">Sim! Totalmente responsivo em todos os dispositivos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

