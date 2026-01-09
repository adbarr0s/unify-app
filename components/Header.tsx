
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => setView(AppView.DASHBOARD)}
          className="flex items-center gap-2 text-blue-600 font-bold text-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Unify
        </button>
        <nav className="hidden lg:flex gap-6">
          <button onClick={() => setView(AppView.DASHBOARD)} className="text-slate-600 hover:text-blue-600 font-medium">Início</button>
          <button onClick={() => setView(AppView.BUREAUCRACY_GUIDE)} className="text-slate-600 hover:text-blue-600 font-medium">Processos</button>
          <button onClick={() => setView(AppView.MY_DOCUMENTS)} className="text-slate-600 hover:text-blue-600 font-medium">Meus Documentos</button>
          <button onClick={() => setView(AppView.RESOURCE_HUB)} className="text-slate-600 hover:text-blue-600 font-medium">Recursos</button>
          <button onClick={() => setView(AppView.COMMUNITY_HUB)} className="text-slate-600 hover:text-blue-600 font-medium">Comunidade</button>
          <button onClick={() => setView(AppView.VOICE_BUDDY)} className="text-slate-600 hover:text-blue-600 font-medium">Assistente Voz</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
