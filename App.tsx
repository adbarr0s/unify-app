
import React, { useState } from 'react';
import { AppView } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DocumentAssistant from './components/DocumentAssistant';
import ResourceFinder from './components/ResourceFinder';
import VoiceBuddy from './components/VoiceBuddy';
import CommunityMap from './components/CommunityMap';
import BureaucracyGuide from './components/BureaucracyGuide';
import CommunityHub from './components/CommunityHub';
import MyDocuments from './components/MyDocuments';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DOC_ASSISTANT:
        return <DocumentAssistant onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.RESOURCE_HUB:
        return <ResourceFinder onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.VOICE_BUDDY:
        return <VoiceBuddy onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.COMMUNITY_MAP:
        return <CommunityMap onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.BUREAUCRACY_GUIDE:
        return <BureaucracyGuide onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.COMMUNITY_HUB:
        return <CommunityHub onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.MY_DOCUMENTS:
        return <MyDocuments onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header setView={setCurrentView} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {renderView()}
      </main>
      <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
        &copy; 2024 Unify - Juntos na Integração. Um serviço de utilidade pública.
      </footer>
    </div>
  );
};

export default App;
