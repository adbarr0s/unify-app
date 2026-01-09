
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface DocumentAssistantProps {
  onBack: () => void;
}

const DocumentAssistant: React.FC<DocumentAssistantProps> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDocument = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: "Explique este documento de forma simples para um imigrante. Identifique o tipo de documento, datas importantes (deadlines), valores a pagar ou acções que a pessoa deve tomar. Escreva em Português simples e acolhedor." }
          ]
        }
      });

      setAnalysis(response.text || "Não foi possível analisar o documento.");
    } catch (error) {
      console.error(error);
      setAnalysis("Ocorreu um erro ao processar o documento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Descodificador de Documentos</h2>
        <p className="text-slate-600">A burocracia pode ser difícil. Carregue uma foto da sua carta ou formulário e nós ajudamos a entender.</p>
      </div>

      <div className="space-y-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-3 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          {image ? (
            <img src={image} alt="Documento" className="max-h-64 rounded-lg shadow-sm" />
          ) : (
            <>
              <div className="bg-blue-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium text-slate-700">Tire uma foto ou carregue um ficheiro</p>
              <p className="text-sm text-slate-400">Suporta JPG, PNG</p>
            </>
          )}
        </div>

        {image && !analysis && (
          <button 
            onClick={analyzeDocument}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-slate-300 transition-colors shadow-lg shadow-blue-200"
          >
            {loading ? "A analisar documento..." : "Descodificar Documento"}
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 animate-pulse italic">A ler as entrelinhas da burocracia...</p>
          </div>
        )}

        {analysis && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explicação Simples
            </h3>
            <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
              {analysis}
            </div>
            <button 
              onClick={() => { setImage(null); setAnalysis(null); }}
              className="mt-6 text-blue-600 font-semibold hover:underline"
            >
              Analisar outro documento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAssistant;
