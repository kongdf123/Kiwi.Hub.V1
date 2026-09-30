import { useState } from 'react';
import { AppProvider, useApp } from '@/lib/app-context';
import { ToastContainer } from '@/components/ui/Toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { AthletesPage } from '@/pages/AthletesPage';
import { AthleteProfilePage } from '@/pages/AthleteProfilePage';
import { TestingPage } from '@/pages/TestingPage';
import { TestResultPage } from '@/pages/TestResultPage';
import { TestLibraryPage } from '@/pages/TestLibraryPage';
import { DataCenterPage } from '@/pages/DataCenterPage';
import { IntegrationsPage } from '@/pages/IntegrationsPage';
import { SyncCenterPage } from '@/pages/SyncCenterPage';
import { TeamDashboardPage } from '@/pages/TeamDashboardPage';
import { ManagementPage } from '@/pages/ManagementPage';
import { ReportsPage } from '@/pages/ReportsPage';

function AppContent() {
  const { currentView, toasts, dismissToast } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomePage />;
      case 'athletes': return <AthletesPage />;
      case 'athlete-profile': return <AthleteProfilePage />;
      case 'testing': return <TestingPage />;
      case 'test-result': return <TestResultPage />;
      case 'test-library': return <TestLibraryPage />;
      case 'data': return <DataCenterPage />;
      case 'integrations': return <IntegrationsPage />;
      case 'sync-center': return <SyncCenterPage />;
      case 'dashboard': return <TeamDashboardPage />;
      case 'management': return <ManagementPage />;
      case 'reports': return <ReportsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />
      <main className="flex-1 min-w-0">
        {renderView()}
      </main>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
