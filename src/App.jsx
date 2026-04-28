import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import MapView from './components/MapView';
import ReportForm from './components/ReportForm';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Stats from './components/Stats';

function AppContent() {
  const [activeTab, setActiveTab] = useState('map');
  const { isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-primary-700 text-lg font-medium">Loading AquaWatch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'map' && <MapView />}
        {activeTab === 'report' && <ReportForm />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'stats' && <Stats />}
      </main>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0891b2',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
