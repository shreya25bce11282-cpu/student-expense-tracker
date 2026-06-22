import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/format';

const ACHIEVEMENTS = [
  { key: 'budgetMaster', icon: '🏅', title: 'Budget Master', desc: 'Stay under budget' },
  { key: 'saver', icon: '🏅', title: 'Saver', desc: 'Reach savings goal' },
  { key: 'consistentTracker', icon: '🏅', title: 'Consistent Tracker', desc: 'Add expenses for 7 consecutive days' },
  { key: 'smartSpender', icon: '🏅', title: 'Smart Spender', desc: 'Keep all categories under 80%' },
];

export default function Profile({ setActive }) {
  const { state, dispatch, theme, setTheme, showToast, totalExpenses, savings, healthScore, healthStatus, healthColor, CATEGORY_COLORS } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...state.user });
  const [goalInput, setGoalInput] = useState(String(state.savingsGoal));

  const handleSaveProfile = () => {
    dispatch({ type: 'UPDATE_USER', payload: form });
    setEditMode(false);
    showToast('Profile updated!');
  };

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
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
      doc.text(`Name: ${state.user.name}`, 14, 65);
      doc.text(`Email: ${state.user.email}`, 14, 73);
      doc.text(`College: ${state.user.college}`, 14, 81);

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Financial Summary', 14, 97);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(11);
      doc.text(`Monthly Budget: ${fmt(state.totalBudget)}`, 14, 107);
      doc.text(`Total Income: ${fmt(state.income)}`, 14, 115);
      doc.text(`Total Expenses: ${fmt(totalExpenses)}`, 14, 123);
      doc.text(`Savings: ${fmt(savings)}`, 14, 131);
      doc.text(`Financial Health Score: ${healthScore}/100 (${healthStatus})`, 14, 139);
      doc.text(`Savings Goal Progress: ${Math.min(100, Math.round((savings / state.savingsGoal) * 100))}% of ${fmt(state.savingsGoal)}`, 14, 147);

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
    { icon: '⚙️', label: 'Settings', action: () => {} },
    { icon: '📄', label: 'Export Report (PDF)', action: handleExportPDF },
    { icon: '❓', label: 'Help & Support', action: () => {} },
    { icon: 'ℹ️', label: 'About App', action: () => showToast('Student Budget Tracker v1.0') },
  ];

  return (
    <div className="page-content" style={{ padding: '0 0 90px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)', padding: '20px 20px 60px', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 800 }}>Profile</h1>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '16px auto 0', border: '3px solid white' }}>
          {state.user.avatar}
        </div>
      </div>

      <div style={{ padding: '0 16px', marginTop: -40 }}>
        {/* Profile Card */}
        <div className="glass card-hover" style={{ borderRadius: 20, padding: '20px', marginBottom: 16, textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>{state.user.name}</h2>
          <p style={{ margin: '0 0 2px', color: '#64748b', fontSize: 14 }}>{state.user.branch}</p>
          <p style={{ margin: '0 0 2px', color: '#64748b', fontSize: 14 }}>{state.user.college}</p>
          <p style={{ margin: '0', color: '#94a3b8', fontSize: 13 }}>{state.user.email}</p>

          {/* Health Score + Streak */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
            <div style={{ background: `${healthColor}20`, borderRadius: 12, padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: healthColor, fontSize: 18 }}>{healthScore}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Health Score</div>
            </div>
            <div style={{ background: '#f39c1220', borderRadius: 12, padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, color: '#f39c12', fontSize: 18 }}>🔥 {state.streak}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Day Streak</div>
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="glass" style={{ borderRadius: 16, padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{theme === 'dark' ? '🌙' : '☀️'} {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Toggle app theme</div>
          </div>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{
              width: 52, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: theme === 'dark' ? '#6C63FF' : '#e2e8f0', transition: 'background 0.3s',
              position: 'relative'
            }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 3, left: theme === 'dark' ? 26 : 3,
              transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>

        {/* Savings Goal */}
        <div className="glass" style={{ borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#64748b', marginBottom: 12 }}>🎯 Monthly Savings Goal</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input-field" type="number" value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              style={{ flex: 1 }} placeholder="Enter goal amount" />
            <button className="btn-primary" style={{ width: 'auto', padding: '12px 16px' }}
              onClick={() => { dispatch({ type: 'SET_SAVINGS_GOAL', payload: Number(goalInput) }); showToast('Goal updated!'); }}>
              Set
            </button>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>
            Current: {fmt(Math.max(0, state.income - (state.expenses.reduce((s,e)=>s+e.amount,0))))} saved toward {fmt(state.savingsGoal)}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass" style={{ borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#64748b', marginBottom: 12 }}>🏆 Achievements</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ACHIEVEMENTS.map(a => {
              const unlocked = state.achievements[a.key];
              return (
                <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: unlocked ? 1 : 0.5 }}>
                  <div style={{ fontSize: 28, filter: unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.desc}</div>
                  </div>
                  {unlocked && <span style={{ marginLeft: 'auto', background: '#2ecc7120', color: '#2ecc71', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✓ Unlocked</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'none', border: 'none', borderBottom: i < menuItems.length - 1 ? '1px solid #e2e8f0' : 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 14, color: '#1a1a2e' }}>{item.label}</span>
              <span style={{ color: '#94a3b8', fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>

        {/* Edit Profile Modal */}
        {editMode && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit Profile</h2>
                <button onClick={() => setEditMode(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['name','email','branch','college'].map(field => (
                  <div key={field}>
                    <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'capitalize' }}>{field}</label>
                    <input className="input-field" value={form[field] || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
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
