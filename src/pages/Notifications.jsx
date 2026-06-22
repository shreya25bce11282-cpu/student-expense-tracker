import { useState } from 'react';
import { useApp } from '../context/AppContext';

const tabs = ['All', 'Alerts', 'Updates'];

export default function Notifications({ setActive }) {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState('All');

  const filtered = state.notifications.filter(n => {
    if (tab === 'All') return true;
    if (tab === 'Alerts') return n.type === 'warning' || n.type === 'danger';
    return n.type === 'info' || n.type === 'success';
  });

  const getIcon = (type) => {
    if (type === 'danger') return { icon: '🔴', bg: '#e74c3c20' };
    if (type === 'warning') return { icon: '🟡', bg: '#f39c1220' };
    if (type === 'success') return { icon: '✅', bg: '#2ecc7120' };
    return { icon: '🔵', bg: '#3498db20' };
  };

  const markAllRead = () => {
    state.notifications.forEach(n => {
      if (!n.read) dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id });
    });
  };

  // Add some demo notifications if empty
  const demoNotifs = filtered.length === 0 && tab === 'All' ? [
    { id: 'd1', type: 'warning', title: 'Budget Alert', message: 'You have spent 80% of your Food budget.', time: '10:30 AM', read: false },
    { id: 'd2', type: 'danger', title: 'Budget Alert', message: 'You have spent 90% of your Shopping budget.', time: 'Yesterday', read: true },
    { id: 'd3', type: 'info', title: 'Budget Alert', message: 'Monthly budget limit is approaching.', time: '2 days ago', read: true },
    { id: 'd4', type: 'success', title: 'Income Added', message: 'Your income of ₹5,000 has been added.', time: '3 days ago', read: true },
  ] : filtered;

  return (
    <div className="page-content" style={{ padding: '0 0 90px' }}>
      <div style={{ background: 'linear-gradient(135deg, #6C63FF, #a78bfa)', padding: '20px 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 800 }}>Notification</h1>
          <button onClick={markAllRead} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: 'white', padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            Mark all read
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {tabs.map(t => (
            <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t}
              {t === 'Alerts' && state.notifications.filter(n => (n.type === 'warning' || n.type === 'danger') && !n.read).length > 0 && (
                <span style={{ background: '#e74c3c', color: 'white', borderRadius: '50%', padding: '1px 5px', fontSize: 10, marginLeft: 4 }}>
                  {state.notifications.filter(n => (n.type === 'warning' || n.type === 'danger') && !n.read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {demoNotifs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
              <div style={{ fontSize: 48 }}>🔕</div>
              <p style={{ margin: '12px 0 0' }}>No notifications yet</p>
            </div>
          ) : demoNotifs.map(n => {
            const { icon, bg } = getIcon(n.type);
            return (
              <div key={n.id} className="glass card-hover fade-in-up"
                style={{ borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, opacity: n.read ? 0.7 : 1, cursor: 'pointer' }}
                onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{n.time}</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>{n.message}</p>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6C63FF', flexShrink: 0, marginTop: 4 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
