
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Resource } from '../types';

interface ResourceFinderProps {
  onBack: () => void;
}

const ResourceFinder: React.FC<ResourceFinderProps> = ({ onBack }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [results, setResults] = useState<{text: string, resources: Resource[]} | null>(null);

  const searchResources = async (searchQuery: string) => {
    if (!searchQuery) return;
    setLoading(true);
    setResults(null);
    setQuery(searchQuery);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Aja como um assistente social. Encontre recursos abrangentes de ajuda para imigrantes/refugiados sobre: ${searchQuery}. 
        Priorize ONGs, serviços públicos e centros de acolhimento. Explique o que cada um faz.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const resources: Resource[] = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || "Recurso de Apoio",
          uri: chunk.web?.uri || "#"
        }));

      setResults({
        text: response.text || "Sem descrição disponível.",
        resources
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: "Aulas de Língua", val: "cursos gratuitos de português para estrangeiros", icon: "📚" },
    { label: "Saúde & SNS", val: "cuidados de saúde para imigrantes sem número de utente", icon: "🏥" },
    { label: "Apoio Jurídico", val: "advogados pro bono e apoio legal para asilo", icon: "⚖️" },
    { label: "Apoio Alimentar", val: "bancos alimentares e cantinas sociais", icon: "🍲" },
    { label: "Habitação", val: "programas de apoio ao arrendamento para refugiados", icon: "🏠" },
    { label: "Emprego", val: "centros de emprego e formação profissional", icon: "💼" }
  ];

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm animate-fade-in min-h-[600px]">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </button>

      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Recursos & Apoio Local</h2>
        <p className="text-slate-600 text-lg">Um diretório inteligente de utilidade pública. Selecione uma categoria ou pesquise o que precisa.</p>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchResources(query)}
            placeholder="Ex: apoio infantil, apoio a vítimas, dentista social..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-400 focus:ring-0 outline-none text-lg transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 absolute left-4 top-4.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button 
          onClick={() => searchResources(query)}
          disabled={loading || !query}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-slate-300 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Pesquisar'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
        {categories.map((c, i) => (
          <button 
            key={i} 
            onClick={() => { setActiveCategory(c.label); searchResources(c.val); }}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${activeCategory === c.label ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'}`}
          >
            <span className="text-2xl">{c.icon}</span>
            <span className="text-xs font-bold text-center leading-tight">{c.label}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-500 font-medium">Buscando as melhores fontes oficiais e ONGs...</p>
        </div>
      )}

      {results && (
        <div className="space-y-8 animate-fade-in pb-10">
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Informação IA</div>
            <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
              Diretório Encontrado
            </h3>
            <div className="text-slate-700 leading-relaxed prose prose-blue max-w-none">
              {results.text}
            </div>
          </div>

          {results.resources.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 px-2 uppercase tracking-wider">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                Links & Contactos Recomendados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.resources.map((res, i) => (
                  <a 
                    key={i} 
                    href={res.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-white border-2 border-slate-50 rounded-2xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group"
                  >
                    <span className="text-slate-800 font-bold text-lg truncate pr-4">{res.title}</span>
                    <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceFinder;
