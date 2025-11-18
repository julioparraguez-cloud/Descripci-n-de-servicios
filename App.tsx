import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import EmergencyButton from './components/EmergencyButton';
import ChatBot from './components/ChatBot';

// The main application is now a vanilla JS SPA in index.html.
// This React app is considered legacy and its views are no longer used.
// We are keeping the shell in case some components need to be rendered in the future.

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('inicio');

  const renderView = () => {
    return (
      <div className="text-center p-8 bg-yellow-100 border border-yellow-300 rounded-md">
          <h1 className="text-2xl font-bold text-yellow-800">Legacy React App</h1>
          <p className="text-yellow-700">This content is from the legacy React application and is not currently displayed. The main application is rendered from index.html.</p>
      </div>
    );
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
