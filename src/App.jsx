import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Splash        from './pages/Splash';
import Login         from './pages/Login';
import Home          from './pages/Home';
import Expenses      from './pages/Expenses';
import Budget        from './pages/Budget';
import Reports       from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile       from './pages/Profile';
import BottomNav     from './components/BottomNav';
import ExpenseModal  from './components/ExpenseModal';

function AppInner() {
  const { theme } = useApp();
  const [screen, setScreen]         = useState('splash');
  const [active, setActiveRaw]      = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);

  /* ── THIS is the one missing piece:
     apply/remove the `dark` class on <html> whenever theme changes.
     Every .dark selector in index.css now works automatically
     across the entire app — no per-component fixes needed. ── */
  useEffect(() => {
    // Apply theme once at the document root so every CSS token works consistently
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const setActive = (page) => setActiveRaw(page);

  if (screen === 'splash') return <Splash onStart={() => setScreen('login')} />;
  if (screen === 'login')  return <Login  onLogin={() => setScreen('app')}  />;

  return (
    <div className="app-container">
      <div style={{ minHeight: '100vh' }}>
        {active === 'home'          && <Home          setActive={setActive} />}
        {active === 'expenses'      && <Expenses />}
        {active === 'budget'        && <Budget />}
        {active === 'reports'       && <Reports />}
        {active === 'notifications' && <Notifications setActive={setActive} />}
        {active === 'profile'       && <Profile       setActive={setActive} />}
      </div>
      <BottomNav
        active={active}
        setActive={setActive}
        onFabClick={() => setShowAddModal(true)}
      />
      {showAddModal && <ExpenseModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}