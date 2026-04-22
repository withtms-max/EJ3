// Build trigger: 2026-03-12 00:35
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import PhotoEditor from './components/PhotoEditor';
import PersonaSetup from './components/PersonaSetup';
import SnsContentCreator, { ContentTab } from './components/SnsContentCreator';
import AdminDashboard from './components/AdminDashboard';
import { ApiKeyProvider } from './context/ApiKeyContext';
import { AuthProvider } from './context/AuthContext';

export type ViewState = 'HOME' | 'EDITOR' | 'SNS_CONTENT' | 'PERSONA' | 'ADMIN';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [snsInitialTab, setSnsInitialTab] = useState<ContentTab | undefined>(undefined);

  const handleNavigate = (view: ViewState, tab?: ContentTab) => {
    setSnsInitialTab(tab);
    setCurrentView(view);
  };

  return (
    <AuthProvider>
      <ApiKeyProvider>
        <Layout currentView={currentView} onNavigate={setCurrentView}>
          {currentView === 'HOME' && <Home onStart={() => handleNavigate('EDITOR')} onNavigate={handleNavigate} />}
          {currentView === 'EDITOR' && <PhotoEditor />}
          {currentView === 'SNS_CONTENT' && <SnsContentCreator initialTab={snsInitialTab} />}
          {currentView === 'PERSONA' && <PersonaSetup />}
          {currentView === 'ADMIN' && <AdminDashboard />}
        </Layout>
      </ApiKeyProvider>
    </AuthProvider>
  );
};

export default App;