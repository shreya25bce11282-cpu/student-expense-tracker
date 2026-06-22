import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'expenses', icon: '📊', label: 'Expenses' },
  { id: null, icon: '+', label: '' },
  { id: 'budget', icon: '💼', label: 'Budget' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

export default function BottomNav({ active, setActive, onFabClick }) {
  const { state } = useApp();
  const unread = state.notifications.filter(n => !n.read).length;

  return (
    <nav className="bottom-nav">
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
        {tabs.map((tab, i) => {
          if (tab.id === null) {
            return (
              <div key="fab" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button className="fab" onClick={onFabClick} aria-label="Add expense">
                  <span style={{ fontSize: 28, lineHeight: 1 }}>+</span>
                </button>
              </div>
            );
          }
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              aria-label={tab.label}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 2, background: 'none', border: 'none',
                cursor: 'pointer', padding: '4px 0', position: 'relative',
                color: active === tab.id ? '#6C63FF' : '#94a3b8',
                transition: 'color 0.2s'
              }}
            >
              <span style={{ fontSize: 22 }}>{tab.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active === tab.id ? 700 : 500 }}>{tab.label}</span>
              {tab.id === 'profile' && unread > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: '25%',
                  background: '#e74c3c', color: 'white', borderRadius: '50%',
                  width: 16, height: 16, fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{unread}</span>
              )}
              {active === tab.id && (
                <div style={{ position: 'absolute', bottom: 0, width: 20, height: 3, background: '#6C63FF', borderRadius: 2 }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
