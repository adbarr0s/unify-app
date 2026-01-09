
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Resource } from '../types';

interface CommunityHubProps {
  onBack: () => void;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'events' | 'mentors' | 'associations'>('events');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<{title: string, desc: string, link: string}[]>([]);

  const loadData = async (type: string) => {
    setLoading(true);
    setItems([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = type === 'events' 
        ? "Encontre eventos culturais, workshops de integração ou feiras de emprego para imigrantes e refugiados esta semana."
        : type === 'mentors' 
        ? "Encontre programas de mentoria, tutoria ou redes de networking para imigrantes recém-chegados."
        : "Encontre associações culturais de imigrantes e grupos de apoio por nacionalidade.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const extracted = groundingChunks
        .filter(c => c.web)
        .map(c => ({
          title: c.web?.title || "Informação de Comunidade",
          desc: "Informação relevante para a sua integração e networking social.",
          link: c.web?.uri || "#"
        }));

      setItems(extracted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm animate-fade-in min-h-[600px]">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </button>

      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3 text-center md:text-left">Conexão & Comunidade</h2>
        <p className="text-slate-600 text-lg text-center md:text-left">Ninguém deve percorrer este caminho sozinho. Encontre pessoas e eventos que partilham a sua jornada.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {[
          { id: 'events', label: 'Eventos & Workshops', icon: '📅' },
          { id: 'mentors', label: 'Mentoria & Networking', icon: '🤝' },
          { id: 'associations', label: 'Associações Culturais', icon: '🏛️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 p-4 rounded-2xl border-2 font-bold text-lg flex items-center justify-center gap-3 transition-all ${activeTab === tab.id ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'}`}
          >
            <span className="text-2xl">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-500 italic font-medium">Buscando oportunidades de conexão na sua região...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.length > 0 ? items.map((item, i) => (
            <a 
              key={i} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-rose-300 hover:shadow-xl hover:shadow-rose-100 transition-all group"
            >
              <div className="bg-rose-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-rose-600 text-2xl group-hover:scale-110 transition-transform">
                {activeTab === 'events' ? '📍' : activeTab === 'mentors' ? '🫂' : '🏡'}
              </div>
              <h4 className="font-bold text-slate-800 text-xl mb-2 line-clamp-2 leading-tight">{item.title}</h4>
              <p className="text-slate-500 text-sm mb-4 line-clamp-3">{item.desc}</p>
              <div className="flex items-center text-rose-600 font-bold text-sm">
                Saber Mais
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          )) : (
            <div className="col-span-full py-20 text-center text-slate-400">
              <p>Nenhuma informação disponível neste momento. Tente outra categoria.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 bg-rose-50 rounded-3xl p-8 border border-rose-100 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white p-4 rounded-full shadow-sm text-4xl">💡</div>
        <div>
          <h4 className="font-bold text-rose-900 text-lg mb-1">Dica da Comunidade</h4>
          <p className="text-rose-700 leading-relaxed">
            As bibliotecas municipais costumam ser os melhores pontos de partida para encontrar wi-fi gratuito, eventos locais e panfletos sobre workshops de integração.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
