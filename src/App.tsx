import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { ProfileModal } from './components/common/ProfileModal';
import { CloudSyncModal } from './components/common/CloudSyncModal';
import { Toaster } from 'react-hot-toast';

// Module Views
import { DashboardView } from './components/dashboard/DashboardView';
import { MotivationView } from './components/motivation/MotivationView';
import { StudyTimerView } from './components/timer/StudyTimerView';
import { NotesView } from './components/notes/NotesView';
import { PdfLibraryView } from './components/pdf/PdfLibraryView';
import { PyqView } from './components/pyq/PyqView';
import { ReadingMaterialView } from './components/reading/ReadingMaterialView';
import { VocabView } from './components/vocab/VocabView';
import { FormulaBookView } from './components/formula/FormulaBookView';
import { MockTestsView } from './components/mocks/MockTestsView';
import { SectionalTestsView } from './components/sectional/SectionalTestsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { GoalsView } from './components/goals/GoalsView';
import { HabitsView } from './components/habits/HabitsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { VaultView } from './components/vault/VaultView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, isProfileModalOpen, setIsProfileModalOpen } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Motivation':
        return <MotivationView />;
      case 'Study Timer':
        return <StudyTimerView />;
      case 'Notes':
        return <NotesView />;
      case 'PDF Library':
        return <PdfLibraryView />;
      case 'PYQ':
        return <PyqView />;
      case 'Reading Material':
        return <ReadingMaterialView />;
      case 'Vocabulary':
        return <VocabView />;
      case 'Formula Book':
        return <FormulaBookView />;
      case 'Mock Tests':
        return <MockTestsView />;
      case 'Sectional Tests':
        return <SectionalTestsView />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Goals':
        return <GoalsView />;
      case 'Habits':
        return <HabitsView />;
      case 'Achievements':
        return <AchievementsView />;
      case 'Vault':
        return <VaultView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-[#F8FAFC] overflow-hidden font-sans select-none antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-black">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-black">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Profile Picture & Details Edit Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Cloud Sync & Firebase Auth Modal */}
      <CloudSyncModal />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#f8fafc',
            border: '1px solid #222222',
            borderRadius: '16px',
            fontSize: '12px',
          },
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
