import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/format';

const ACHIEVEMENTS = [
  { key: 'budgetMaster',      icon: '🏅', title: 'Budget Master',        desc: 'Stay under budget' },
  { key: 'saver',             icon: '🏅', title: 'Saver',                desc: 'Reach savings goal' },
  { key: 'consistentTracker', icon: '🏅', title: 'Consistent Tracker',   desc: 'Add expenses for 7 consecutive days' },
  { key: 'smartSpender',      icon: '🏅', title: 'Smart Spender',        desc: 'Keep all categories under 80%' },
];

/* ─── CSS injected once ──────────────────────────────────────────────── */
const STYLE = `
  .profile-root {
    --text-primary:   #1a1a2e;
    --text-secondary: #64748b;
    --text-muted:     #94a3b8;
    --border-color:   #e2e8f0;
    --card-bg:        rgba(255,255,255,0.85);
    --input-bg:       #f8fafc;
    --toggle-off-bg:  #e2e8f0;
    --menu-hover-bg:  #f8fafc;
  }

  @media (prefers-color-scheme: dark) {
    .profile-root {
      --text-primary:   #f1f5f9;
      --text-secondary: #94a3b8;
      --text-muted:     #64748b;
      --border-color:   #334155;
      --card-bg:        rgba(30,41,59,0.85);
      --input-bg:       #1e293b;
      --toggle-off-bg:  #334155;
      --menu-hover-bg:  #1e293b;
    }
  }

  /* also support a .dark class on <html> or a parent for JS-controlled theme */
  .dark .profile-root,
  [data-theme="dark"] .profile-root {
    --text-primary:   #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted:     #64748b;
    --border-color:   #334155;
    --card-bg:        rgba(30,41,59,0.85);
    --input-bg:       #1e293b;
    --toggle-off-bg:  #334155;
    --menu-hover-bg:  #1e293b;
  }

  .profile-card {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 16px;
    text-align: center;
    backdrop-filter: blur(10px);
  }

  .profile-name {
    margin: 0 0 4px;
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
  }

  .profile-sub {
    margin: 0 0 2px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .profile-email {
    margin: 0;
    color: var(--text-muted);
    font-size: 13px;
  }

  .profile-section {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 16px;
    backdrop-filter: blur(10px);
  }

  .section-label {
    font-weight: 700;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }

  .stat-box {
    border-radius: 12px;
    padding: 8px 16px;
    text-align: center;
  }

  .stat-value {
    font-weight: 800;
    font-size: 18px;
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-secondary);
  }

  .profile-input {
    width: 100%;
    box-sizing: border-box;
    background: var(--input-bg);
    color: var(--text-primary);
    border: 1.5px solid var(--border-color);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .profile-input:focus {
    border-color: #6C63FF;
  }

  .savings-hint {
    margin-top: 10px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .achievement-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .achievement-title {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-primary);
  }

  .achievement-desc {
    font-size: 12px;
    color: var(--text-muted);
  }

  .menu-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s;
  }

  .menu-btn:hover {
    background: var(--menu-hover-bg);
  }

  .menu-btn-label {
    flex: 1;
    font-weight: 500;
    font-size: 14px;
    color: var(--text-primary);
  }

  .menu-chevron {
    color: var(--text-muted);
    font-size: 18px;
  }

  .menu-divider {
    border-bottom: 1px solid var(--border-color);
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
  }

  .modal-box {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 24px;
    width: 100%;
    max-width: 380px;
    backdrop-filter: blur(20px);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .modal-close {
    background: var(--input-bg);
    border: none;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 18px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .field-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
    text-transform: capitalize;
  }

  .toggle-track {
    width: 52px;
    height: 28px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    position: relative;
    transition: background 0.3s;
    flex-shrink: 0;
  }

  .toggle-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 3px;
    transition: left 0.3s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.25);
  }
`;

function injectStyle() {
  if (typeof document !== 'undefined' && !document.getElementById('profile-styles')) {
    const el = document.createElement('style');
    el.id = 'profile-styles';
    el.textContent = STYLE;
    document.head.appendChild(el);
  }
}

export default function Profile({ setActive }) {
  injectStyle();

  const {
    state, dispatch, theme, setTheme, showToast,
    totalExpenses, savings, healthScore, healthStatus, healthColor,
  } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({ ...state.user });
  const [goalInput, setGoalInput] = useState(String(state.savingsGoal));

  const handleSaveProfile = () => {
    dispatch({ type: 'UPDATE_USER', payload: form });
    setEditMode(false);
    showToast('Profile updated!');
  };

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc   = new jsPDF();
      const today = new Date().toISOString().split('T')[0];

      doc.setFillColor(108, 99, 255);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Expense Report', 14, 20);
      doc.setFontSize(11);
      doc.text(`Generated: ${today}`, 14, 32);

      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('User Details', 14, 55);
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Name: ${state.user.name}`,     14, 65);
      doc.text(`Email: ${state.user.email}`,   14, 73);
      doc.text(`College: ${state.user.college}`, 14, 81);

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Financial Summary', 14, 97);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(11);
      doc.text(`Monthly Budget: ${fmt(state.totalBudget)}`,   14, 107);
      doc.text(`Total Income: ${fmt(state.income)}`,          14, 115);
      doc.text(`Total Expenses: ${fmt(totalExpenses)}`,       14, 123);
      doc.text(`Savings: ${fmt(savings)}`,                    14, 131);
      doc.text(`Financial Health: ${healthScore}/100 (${healthStatus})`, 14, 139);
      doc.text(
        `Savings Goal: ${Math.min(100, Math.round((savings / state.savingsGoal) * 100))}% of ${fmt(state.savingsGoal)}`,
        14, 147
      );

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Category Budgets', 14, 163);
      let y = 173;
      Object.entries(state.categoryBudgets).forEach(([cat, budget]) => {
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        doc.text(`${cat}: ${fmt(budget)}`, 14, y);
        y += 8;
      });

      y += 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Recent Expenses', 14, y);
      y += 10;
      state.expenses.slice(0, 10).forEach(e => {
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(`${e.date}  ${e.name} (${e.category})  ${fmt(e.amount)}`, 14, y);
        y += 7;
        if (y > 270) { doc.addPage(); y = 20; }
      });

      doc.save(`expense-report-${today}.pdf`);
      showToast('PDF exported!');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
    }
  };

  const menuItems = [
    { icon: '👤', label: 'Personal Information', action: () => setEditMode(true) },
    { icon: '⚙️', label: 'Settings',             action: () => {} },
    { icon: '📄', label: 'Export Report (PDF)',  action: handleExportPDF },
    { icon: '❓', label: 'Help & Support',        action: () => {} },
    { icon: 'ℹ️', label: 'About App',            action: () => showToast('Student Budget Tracker v1.0') },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="profile-root page-content" style={{ padding: '0 0 90px' }}>

      {/* ── Header gradient ── */}
      <div style={{
        background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)',
        padding: '20px 20px 60px',
        textAlign: 'center',
      }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 800 }}>Profile</h1>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '16px auto 0', border: '3px solid white',
        }}>
          {state.user.avatar}
        </div>
      </div>

      <div style={{ padding: '0 16px', marginTop: -40 }}>

        {/* ── Profile card ── */}
        <div className="profile-card">
          <h2 className="profile-name">{state.user.name}</h2>
          <p className="profile-sub">{state.user.branch}</p>
          <p className="profile-sub">{state.user.college}</p>
          <p className="profile-email">{state.user.email}</p>

          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
            <div className="stat-box" style={{ background: `${healthColor}20` }}>
              <div className="stat-value" style={{ color: healthColor }}>{healthScore}</div>
              <div className="stat-label">Health Score</div>
            </div>
            <div className="stat-box" style={{ background: '#f39c1220' }}>
              <div className="stat-value" style={{ color: '#f39c12' }}>🔥 {state.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </div>

        {/* ── Dark mode toggle ── */}
        <div className="profile-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Toggle app theme</div>
          </div>
          <button
            className="toggle-track"
            style={{ background: isDark ? '#6C63FF' : 'var(--toggle-off-bg)' }}
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark mode"
          >
            <div className="toggle-thumb" style={{ left: isDark ? 26 : 3 }} />
          </button>
        </div>

        {/* ── Savings goal ── */}
        <div className="profile-section">
          <div className="section-label">🎯 Monthly Savings Goal</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="profile-input"
              type="number"
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              placeholder="Enter goal amount"
              style={{ flex: 1 }}
            />
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '12px 16px' }}
              onClick={() => {
                dispatch({ type: 'SET_SAVINGS_GOAL', payload: Number(goalInput) });
                showToast('Goal updated!');
              }}
            >
              Set
            </button>
          </div>
          <p className="savings-hint">
            Current: {fmt(Math.max(0, state.income - state.expenses.reduce((s, e) => s + e.amount, 0)))} saved toward {fmt(state.savingsGoal)}
          </p>
        </div>

        {/* ── Achievements ── */}
        <div className="profile-section">
          <div className="section-label">🏆 Achievements</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ACHIEVEMENTS.map(a => {
              const unlocked = state.achievements[a.key];
              return (
                <div key={a.key} className="achievement-row" style={{ opacity: unlocked ? 1 : 0.45 }}>
                  <div style={{ fontSize: 28, filter: unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
                  <div>
                    <div className="achievement-title">{a.title}</div>
                    <div className="achievement-desc">{a.desc}</div>
                  </div>
                  {unlocked && (
                    <span style={{
                      marginLeft: 'auto',
                      background: '#2ecc7120', color: '#2ecc71',
                      borderRadius: 6, padding: '2px 8px',
                      fontSize: 11, fontWeight: 700,
                    }}>
                      ✓ Unlocked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Menu list ── */}
        <div className="profile-section" style={{ padding: 0, overflow: 'hidden' }}>
          {menuItems.map((item, i) => (
            <button
              key={i}
              className={`menu-btn${i < menuItems.length - 1 ? ' menu-divider' : ''}`}
              onClick={item.action}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span className="menu-btn-label">{item.label}</span>
              <span className="menu-chevron">›</span>
            </button>
          ))}
        </div>

        {/* ── Edit profile modal ── */}
        {editMode && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditMode(false); }}>
            <div className="modal-box">
              <div className="modal-header">
                <h2 className="modal-title">Edit Profile</h2>
                <button className="modal-close" onClick={() => setEditMode(false)}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['name', 'email', 'branch', 'college'].map(field => (
                  <div key={field}>
                    <label className="field-label">{field}</label>
                    <input
                      className="profile-input"
                      value={form[field] || ''}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    />
                  </div>
                ))}
                <button className="btn-primary" onClick={handleSaveProfile}>Save Profile</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}