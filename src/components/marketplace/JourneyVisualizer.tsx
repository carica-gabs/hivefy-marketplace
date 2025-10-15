'use client';

import React, { useState, useEffect } from 'react';

interface Journey {
  id: string;
  name: string;
  description: string;
  persona: string;
  context: string;
  quickWins: string[];
  mrrTarget: string[];
  projetos: string[];
  metrics: {
    success: string;
    roi: string;
  };
  timeline: {
    week: number;
    milestone: string;
    deliverables: string[];
  }[];
}

export const JourneyVisualizer: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // mock data - em produção viria de API
  const mockJourneys: Journey[] = [
    {
      id: 'startup_series_a',
      name: 'startup series a (R$ 10-25M)',
      description: 'foco em aquisição forte para acelerar crescimento',
      persona: 'CEO/CTO de startup com 20-50 funcionários',
      context: 'recém captou série A, precisa escalar vendas rapidamente',
      quickWins: ['auditoria aquisição', 'setup sofia básico'],
      mrrTarget: ['sofia ia sdr', 'centro comando clareza'],
      projetos: [],
      metrics: {
        success: 'CAC reduzido 40%, pipeline 3x maior',
        roi: 'R$ 170k/ano em 12 meses'
      },
      timeline: [
        { week: 1, milestone: 'auditoria aquisição', deliverables: ['relatório vazamentos', 'plano ação'] },
        { week: 2, milestone: 'setup sofia', deliverables: ['sofia configurada', '10 prospects teste'] },
        { week: 4, milestone: 'sofia ativa', deliverables: ['pipeline gerado', 'meetings agendados'] },
        { week: 8, milestone: 'centro comando', deliverables: ['dashboard vendas', 'insights ativos'] },
        { week: 12, milestone: 'otimização', deliverables: ['CAC otimizado', 'ROI comprovado'] }
      ]
    },
    {
      id: 'scaleup_series_b',
      name: 'scaleup series B (R$ 25-50M)',
      description: 'foco em operação para sustentar crescimento',
      persona: 'COO/VP Ops de scaleup com 50-200 funcionários',
      context: 'crescimento acelerado, operação não acompanha',
      quickWins: ['auditoria operacional', 'automação 1 processo'],
      mrrTarget: ['otto ia ops', 'centro comando domínio'],
      projetos: ['implementação completa'],
      metrics: {
        success: 'eficiência 50% maior, custos 30% menores',
        roi: 'R$ 451k em 24 meses'
      },
      timeline: [
        { week: 1, milestone: 'auditoria ops', deliverables: ['mapeamento processos', 'identificação desperdícios'] },
        { week: 3, milestone: 'automação piloto', deliverables: ['1 processo automatizado', 'economia comprovada'] },
        { week: 6, milestone: 'otto ativo', deliverables: ['workflows ativos', 'horas economizadas'] },
        { week: 12, milestone: 'centro domínio', deliverables: ['visão 360', 'orquestração ativa'] },
        { week: 24, milestone: 'transformação', deliverables: ['operação otimizada', 'ROI 5x+'] }
      ]
    },
    {
      id: 'enterprise',
      name: 'enterprise (R$ 50M+)',
      description: 'foco em orquestração e transformação digital',
      persona: 'C-level de empresa consolidada com 200+ funcionários',
      context: 'empresa madura, precisa de transformação digital',
      quickWins: ['diagnóstico executivo', 'dashboard executivo'],
      mrrTarget: ['centro comando serenidade'],
      projetos: ['consultoria transformação', 'advisory board'],
      metrics: {
        success: 'decisões 70% mais rápidas, operação sem fricção',
        roi: 'R$ 1.59M em 24 meses'
      },
      timeline: [
        { week: 1, milestone: 'diagnóstico', deliverables: ['ClarityScore', 'roadmap 90d'] },
        { week: 4, milestone: 'dashboard exec', deliverables: ['vital attributes', 'alertas ativos'] },
        { week: 8, milestone: 'consultoria start', deliverables: ['redesenho motores', 'org alvo'] },
        { week: 16, milestone: 'serenidade ativa', deliverables: ['operação sem fricção', 'SLOs cumpridos'] },
        { week: 24, milestone: 'transformação', deliverables: ['nova operação', 'ROI 10x+'] }
      ]
    }
  ];

  useEffect(() => {
    // simular carregamento
    setTimeout(() => {
      setJourneys(mockJourneys);
      setSelectedJourney(mockJourneys[0].id);
      setLoading(false);
    }, 1000);
  }, []);

  const handleJourneySelect = (journeyId: string) => {
    setSelectedJourney(journeyId);
    
    // tracking: journey viewed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'journey_viewed', {
        journey_id: journeyId,
        journey_name: journeys.find(j => j.id === journeyId)?.name
      });
    }
  };

  const handleMilestoneClick = (journeyId: string, milestone: string) => {
    // tracking: milestone viewed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'milestone_viewed', {
        journey_id: journeyId,
        milestone: milestone
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">carregando jornadas...</div>
      </div>
    );
  }

  const currentJourney = journeys.find(j => j.id === selectedJourney);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          jornadas típicas — land & expand
        </h1>
        <p className="text-gray-600">
          expansão previsível: quick wins → mrr → projetos
        </p>
      </div>

      {/* seleção de jornada */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">escolha uma jornada</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {journeys.map(journey => (
            <button
              key={journey.id}
              onClick={() => handleJourneySelect(journey.id)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                selectedJourney === journey.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-lg">{journey.name}</div>
              <div className="text-sm text-gray-600 mt-1">{journey.description}</div>
              <div className="text-xs text-gray-500 mt-2">
                {journey.timeline.length} milestones • {journey.mrrTarget.length} produtos mrr
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* jornada selecionada */}
      {currentJourney && (
        <div className="space-y-8">
          {/* overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">{currentJourney.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">persona</h4>
                <p className="text-gray-600">{currentJourney.persona}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">contexto</h4>
                <p className="text-gray-600">{currentJourney.context}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">quick wins</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentJourney.quickWins.map((win, index) => (
                    <li key={index}>• {win}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">mrr alvo</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentJourney.mrrTarget.map((product, index) => (
                    <li key={index}>• {product}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">projetos</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentJourney.projetos.length > 0 ? (
                    currentJourney.projetos.map((projeto, index) => (
                      <li key={index}>• {projeto}</li>
                    ))
                  ) : (
                    <li>• nenhum projeto</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">métrica de sucesso</h4>
                <p className="text-sm text-gray-600">{currentJourney.metrics.success}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">roi esperado</h4>
                <p className="text-sm text-gray-600">{currentJourney.metrics.roi}</p>
              </div>
            </div>
          </div>

          {/* timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6">timeline da jornada</h3>
            <div className="space-y-6">
              {currentJourney.timeline.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {/* linha do tempo */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {milestone.week}
                    </div>
                    {index < currentJourney.timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                    )}
                  </div>
                  
                  {/* conteúdo */}
                  <div className="flex-1 pb-8">
                    <button
                      onClick={() => handleMilestoneClick(currentJourney.id, milestone.milestone)}
                      className="text-left hover:bg-gray-50 p-3 rounded-lg transition-colors w-full"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        semana {milestone.week}: {milestone.milestone}
                      </h4>
                      <div className="space-y-1">
                        {milestone.deliverables.map((deliverable, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {deliverable}
                          </div>
                        ))}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* cta */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              pronto para começar esta jornada?
            </h3>
            <p className="text-gray-600 mb-4">
              comece com um quick win e expanda gradualmente
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'journey_start_requested', {
                      journey_id: currentJourney.id,
                      journey_name: currentJourney.name
                    });
                  }
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                começar jornada
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'journey_demo_requested', {
                      journey_id: currentJourney.id,
                      journey_name: currentJourney.name
                    });
                  }
                }}
                className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
              >
                agendar demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
