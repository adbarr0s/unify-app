
import React from 'react';
import { AppView } from '../types';

interface DashboardProps {
  setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const cards = [
    {
      view: AppView.BUREAUCRACY_GUIDE,
      title: "Guias & Processos",
      desc: "Checklists passo-a-passo para vistos, residência, trabalho e benefícios sociais.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: "bg-indigo-50 border-indigo-100"
    },
    {
      view: AppView.MY_DOCUMENTS,
      title: "Meus Documentos",
      desc: "Guarde cópias seguras de seus documentos, fotos e PDFs categorizados por tipo.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      color: "bg-teal-50 border-teal-100"
    },
    {
      view: AppView.RESOURCE_HUB,
      title: "Recursos Locais",
      desc: "Guia completo de saúde, aulas de língua, bancos alimentares e apoio jurídico.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: "bg-green-50 border-green-100"
    },
    {
      view: AppView.COMMUNITY_HUB,
      title: "Hub da Comunidade",
      desc: "Conecte-se com mentores, associações culturais e eventos locais perto de si.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-rose-50 border-rose-100"
    },
    {
      view: AppView.DOC_ASSISTANT,
      title: "Análise de Documentos",
      desc: "Tire fotos de cartas oficiais para receber uma explicação simples e clara.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-blue-50 border-blue-100"
    },
    {
      view: AppView.VOICE_BUDDY,
      title: "Assistente de Voz",
      desc: "Tire dúvidas e pratique a língua em tempo real com o nosso tutor de IA.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      color: "bg-purple-50 border-purple-100"
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Sua Nova Jornada Começa Aqui</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">Unify é uma plataforma de utilidade pública para ajudar na sua integração. Escolha uma das ferramentas abaixo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => setView(card.view)}
            className={`${card.color} border-2 p-6 rounded-3xl text-left transition-all hover:scale-[1.02] hover:shadow-xl flex flex-col gap-4 group h-full`}
          >
            <div className="bg-white p-3 rounded-2xl w-fit shadow-sm">
              {card.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-slate-600 mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center text-blue-600 font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              Começar agora
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="bg-blue-500/30 text-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Apoio em Emergência</span>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Precisa de suporte jurídico ou social urgente?</h2>
            <p className="text-blue-100 mb-8 text-lg opacity-90">Nossa rede de recursos inclui organizações prontas para ajudar em situações críticas de residência ou risco.</p>
            <button 
              onClick={() => setView(AppView.RESOURCE_HUB)}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-white/20 active:scale-95"
            >
              Encontrar Ajuda Imediata
            </button>
          </div>
          <div className="flex-shrink-0 w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
        </div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;
