
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { StepGuide } from '../types';

interface BureaucracyGuideProps {
  onBack: () => void;
}

const BureaucracyGuide: React.FC<BureaucracyGuideProps> = ({ onBack }) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<StepGuide | null>(null);

  const generateGuide = async (selectedTopic: string) => {
    setLoading(true);
    setGuide(null);
    setTopic(selectedTopic);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um guia passo-a-passo detalhado e burocrático para um imigrante ou refugiado sobre: ${selectedTopic}. 
        Inclua um título, uma lista de passos concretos e links oficiais recomendados (reais).
        Formate a resposta para ser fácil de seguir.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["label", "description"]
                }
              },
              officialLinks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    uri: { type: Type.STRING }
                  },
                  required: ["title", "uri"]
                }
              }
            },
            required: ["title", "steps", "officialLinks"]
          }
        }
      });

      const data = JSON.parse(response.text);
      setGuide({
        ...data,
        steps: data.steps.map((s: any) => ({ ...s, completed: false }))
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (index: number) => {
    if (!guide) return;
    const newSteps = [...guide.steps];
    newSteps[index].completed = !newSteps[index].completed;
    setGuide({ ...guide, steps: newSteps });
  };

  const commonTopics = [
    { label: "Obter Visto de Trabalho", val: "obtenção de visto de trabalho e autorização de residência" },
    { label: "Registrar Morada (Atestado)", val: "registo de morada e atestado de residência na junta de freguesia" },
    { label: "NIF e Segurança Social", val: "obtenção de NIF (Número de Identificação Fiscal) e NISS" },
    { label: "Acesso ao SNS (Saúde)", val: "inscrição no centro de saúde e acesso ao sistema nacional de saúde" },
    { label: "Substituir Carta de Condução", val: "troca de carta de condução estrangeira" }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm animate-fade-in min-h-[600px]">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar ao Início
      </button>

      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Navegador Burocrático</h2>
        <p className="text-slate-600 text-lg">Entenda o caminho legal e administrativo para sua estabilização. Escolha um processo para gerar o seu checklist personalizado.</p>
      </div>

      {!guide && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonTopics.map((t, i) => (
            <button
              key={i}
              onClick={() => generateGuide(t.val)}
              className="p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all flex justify-between items-center group"
            >
              <span className="font-bold text-slate-800 text-lg">{t.label}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-slate-600 font-medium animate-pulse">Consultando legislação e procedimentos atualizados...</p>
        </div>
      )}

      {guide && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-6">
            <h3 className="text-2xl font-bold text-indigo-900">{guide.title}</h3>
            <button 
              onClick={() => setGuide(null)}
              className="text-slate-400 hover:text-red-500 font-medium flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar
            </button>
          </div>

          <div className="space-y-4">
            {guide.steps.map((step, idx) => (
              <div 
                key={idx} 
                onClick={() => toggleStep(idx)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 ${step.completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${step.completed ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {step.completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : idx + 1}
                </div>
                <div>
                  <h4 className={`font-bold text-lg mb-1 ${step.completed ? 'text-green-800 line-through opacity-70' : 'text-slate-800'}`}>{step.label}</h4>
                  <p className={`text-slate-600 leading-relaxed ${step.completed ? 'opacity-50' : ''}`}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.243a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM16.243 13.536a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707z" />
              </svg>
              Links Oficiais de Apoio
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guide.officialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-xl border border-indigo-100 flex items-center justify-between hover:bg-indigo-100/50 transition-colors"
                >
                  <span className="font-medium text-slate-700">{link.title}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BureaucracyGuide;
