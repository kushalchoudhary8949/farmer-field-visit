import React from 'react';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/ToastContainer';
import { CompostProvider, useCompost } from './context/CompostContext';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CompostBatchesPage } from './pages/CompostBatchesPage';
import { DashboardPage } from './pages/DashboardPage';
import { MaturityAssessmentPage } from './pages/MaturityAssessmentPage';
import { ProcessGuidePage } from './pages/ProcessGuidePage';
import { RecordSheetPage } from './pages/RecordSheetPage';
import { SettingsPage } from './pages/SettingsPage';
import { WasteSortingPage } from './pages/WasteSortingPage';

const ActivePageRouter: React.FC = () => {
  const { activePage } = useCompost();

  switch (activePage) {
    case 'dashboard':
      return <DashboardPage />;
    case 'sorting':
      return <WasteSortingPage />;
    case 'batches':
      return <CompostBatchesPage />;
    case 'guide':
      return <ProcessGuidePage />;
    case 'records':
      return <RecordSheetPage />;
    case 'maturity':
      return <MaturityAssessmentPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
};

export default function App() {
  return (
    <CompostProvider>
      <Layout>
        <ActivePageRouter />
      </Layout>
      <ToastContainer />
    </CompostProvider>
  );
}
