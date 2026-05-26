import React from 'react';
import './index.css';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Gruppen from './pages/Gruppen';
import Chat from './pages/Chat';
import Training from './pages/Training';
import Events from './pages/Events';
import Aufgaben from './pages/Aufgaben';
import Wettkampf from './pages/Wettkampf';

function AppContent() {
  const { currentUser, authLoading, login, activePage } = useApp();

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20 }}>LC</div>
          <p style={{ color: 'var(--grey-400)', fontSize: 13 }}>Laden…</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={login} />;
  }

  const pages = {
    dashboard: <Dashboard />,
    gruppen:   <Gruppen />,
    chat:      <Chat />,
    training:  <Training />,
    events:    <Events />,
    aufgaben:  <Aufgaben />,
    wettkampf: <Wettkampf />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        {pages[activePage] || <Dashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
