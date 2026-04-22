// Build trigger: 2026-03-12 00:35
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import PhotoEditor from './components/PhotoEditor';
import Portfolio from './components/Portfolio';
import PersonaSetup from './components/PersonaSetup';
import SnsContentCreator, { ContentTab } from './components/SnsContentCreator';
import AdminDashboard from './components/AdminDashboard';
import { ApiKeyProvider } from './context/ApiKeyContext';
import { AuthProvider } from './context/AuthContext';

export type ViewState = 'HOME' | 'EDITOR' | 'SNS_CONTENT' | 'PERSONA' | 'ADMIN' | 'PORTFOLIO';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');

  // [URL 라우팅] 특정 뷰로 바로가기 지원
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const targetView = params.get('view');
      if (targetView === 'admin') setCurrentView('ADMIN');
      else if (targetView === 'home') setCurrentView('HOME');
      else if (targetView === 'portfolio') setCurrentView('PORTFOLIO');
      else if (targetView === 'sns') setCurrentView('SNS_CONTENT');
      else if (targetView === 'editor') setCurrentView('EDITOR');
  }, []);

  const [snsInitialTab, setSnsInitialTab] = useState<ContentTab | undefined>(undefined);

  const handleNavigate = (view: ViewState, tab?: ContentTab) => {
    setSnsInitialTab(tab);
    setCurrentView(view);
  };

  return (
    <AuthProvider>
      <ApiKeyProvider>
        <Layout currentView={currentView} onNavigate={handleNavigate}>
          {currentView === 'HOME' && <Home onStart={() => handleNavigate('EDITOR')} onNavigate={handleNavigate} />}
          {currentView === 'EDITOR' && <PhotoEditor onGoHome={() => handleNavigate('HOME')} />}
          {currentView === 'SNS_CONTENT' && <SnsContentCreator initialTab={snsInitialTab} onGoHome={() => handleNavigate('HOME')} />}
          {currentView === 'PERSONA' && <PersonaSetup />}
          {currentView === 'ADMIN' && <AdminDashboard />}
          {currentView === 'PORTFOLIO' && <Portfolio />}
        </Layout>
      </ApiKeyProvider>
    </AuthProvider>
  );
};

export default App;