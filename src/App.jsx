import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import ExpenseModal from './components/ExpenseModal';

function AppInner() {
  const [screen, setScreen] = useState('splash');
  const [active, setActiveRaw] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);

  const setActive = (page) => setActiveRaw(page);

  if (screen === 'splash') return <Splash onStart={() => setScreen('login')} />;
  if (screen === 'login') return <Login onLogin={() => setScreen('app')} />;

  return (
    <div className="app-container">
      <div style={{ minHeight: '100vh' }}>
        {active === 'home' && <Home setActive={setActive} />}
        {active === 'expenses' && <Expenses />}
        {active === 'budget' && <Budget />}
        {active === 'reports' && <Reports />}
        {active === 'notifications' && <Notifications setActive={setActive} />}
        {active === 'profile' && <Profile setActive={setActive} />}
      </div>
      <BottomNav active={active} setActive={setActive} onFabClick={() => setShowAddModal(true)} />
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
