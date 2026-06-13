import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';

const assistantLinks = [
  { to: '/assistant/dashboard', label: 'Dashboard', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { to: '/assistant/payments', label: 'Verify Payments', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { to: '/assistant/queue', label: 'Appointment Queue', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
];

const pageTitles = { '/assistant/dashboard': 'Assistant Dashboard', '/assistant/payments': 'Payment Verification', '/assistant/queue': 'Appointment Queue' };

const AssistantLayout = () => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar links={assistantLinks} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Topbar title={pageTitles[location.pathname] || 'Doctor Hub'} />
        <main className="flex-1 p-6 overflow-auto bg-mesh"><Outlet /></main>
      </div>
    </div>
  );
};

export default AssistantLayout;
