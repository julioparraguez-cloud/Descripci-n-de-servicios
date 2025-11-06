
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import EmergencyButton from './components/EmergencyButton';
import ChatBot from './components/ChatBot';
import Inicio from './views/Inicio';
import Tramites from './views/Tramites';
import Programas from './views/Programas';
import Vive from './views/Vive';
import Participa from './views/Participa';
import Municipio from './views/Municipio';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState(window.location.hash.substring(1) || 'inicio');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(window.location.hash.substring(1) || 'inicio');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'tramites':
        return <Tramites />;
      case 'programas':
        return <Programas />;
      case 'vive':
        return <Vive />;
      case 'participa':
        return <Participa />;
      case 'municipio':
        return <Municipio />;
      case 'inicio':
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderView()}
      </main>
      <Footer />
      <EmergencyButton />
      <ChatBot />
    </div>
  );
};

export default App;
