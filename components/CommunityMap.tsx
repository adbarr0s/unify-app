
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MapPlace } from '../types';

interface CommunityMapProps {
  onBack: () => void;
}

const CommunityMap: React.FC<CommunityMapProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("Geolocation denied", err)
    );
  }, []);

  const findNearby = async (category: string) => {
    setLoading(true);
    setPlaces([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Encontre ${category} seguros e acolhedores perto da minha localização. Explique brevemente o que cada lugar oferece para um recém-chegado.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: location ? { latitude: location.lat, longitude: location.lng } : undefined
            }
          }
        }
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const extractedPlaces = chunks
        .filter(c => c.maps)
        .map(c => ({ title: c.maps?.title || "Localização", uri: c.maps?.uri || "#" }));

      setPlaces(extractedPlaces);
      setExplanation(response.text || "");
    } catch (error) {
      console.error(error);
      setExplanation("Ocorreu um erro ao carregar o mapa. Verifique se o acesso à localização está ativo.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: "Centros de Saúde", val: "centros de saúde e hospitais públicos" },
    { label: "Locais de Culto", val: "mesquitas, igrejas e templos" },
    { label: "Apoio ao Imigrante", val: "associações de apoio a imigrantes e refugiados" },
    { label: "Bibliotecas e Wi-Fi", val: "bibliotecas públicas com internet grátis" }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm min-h-[500px]">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">Mapa da Comunidade</h2>
      <p className="text-slate-600 mb-8">Saiba onde estão os pontos essenciais perto de si. A sua localização ajuda-nos a ser precisos.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {categories.map((c, i) => (
          <button 
            key={i} 
            onClick={() => findNearby(c.val)}
            className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all text-sm font-bold shadow-sm"
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center py-20 animate-fade-in">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 italic">Mapeando a vizinhança...</p>
        </div>
      )}

      {explanation && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <h3 className="font-bold text-amber-800 mb-3">Recomendações Próximas</h3>
            <div className="text-slate-700 prose prose-sm max-w-none">
              {explanation}
            </div>
          </div>

          {places.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {places.map((p, i) => (
                <a 
                  key={i} 
                  href={p.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="bg-red-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-800 truncate">{p.title}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityMap;
