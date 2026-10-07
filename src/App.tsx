import React, { useState, useEffect } from 'react';
import initialScheduleData from './data/workbookSchedule.json';
import { ChargeSession } from './types';
import { Header } from './components/Header';
import { AllocatorView } from './components/AllocatorView';
import { ScheduleView } from './components/ScheduleView';
import { ChargersView } from './components/ChargersView';
import { OverviewView } from './components/OverviewView';

const STORAGE_KEY = 'eb_depot_schedule_sessions';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('allocate');
  const [sessions, setSessions] = useState<ChargeSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialScheduleData as ChargeSession[];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error(e);
    }
  }, [sessions]);

  const handleAddSession = (newSession: ChargeSession) => {
    setSessions(prev => [newSession, ...prev]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        sessionCount={sessions.length}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {currentTab === 'allocate' && (
          <AllocatorView
            sessions={sessions}
            onAddSession={handleAddSession}
          />
        )}
        {currentTab === 'overview' && (
          <OverviewView
            sessions={sessions}
            onGoToAllocate={() => setCurrentTab('allocate')}
            onGoToSchedule={() => setCurrentTab('schedule')}
          />
        )}
        {currentTab === 'schedule' && (
          <ScheduleView
            sessions={sessions}
            onDeleteSession={handleDeleteSession}
            onAddSession={handleAddSession}
          />
        )}
        {currentTab === 'chargers' && (
          <ChargersView sessions={sessions} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        <p>DepotCharge WebApp · Electric Bus Automated Fast Charging Allocation Engine</p>
      </footer>
    </div>
  );
};

export default App;
