import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/format';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Education', 'Entertainment', 'Health', 'Bills'];

export default function Budget() {
  const { state, dispatch, showToast, catTotals, CATEGORY_ICONS, CATEGORY_COLORS } = useApp();
  const [total, setTotal] = useState(String(state.totalBudget));
  const [cats, setCats] = useState({ ...state.categoryBudgets });

  const handleSave = () => {
    const totalBudget = Number(total);
    if (!totalBudget || isNaN(totalBudget)) { showToast('Enter a valid budget', 'error'); return; }
    dispatch({ type: 'SET_BUDGET', payload: { total: totalBudget, categories: Object.fromEntries(Object.entries(cats).map(([k,v]) => [k, Number(v) || 0])) } });
    showToast('Budget saved!');
  };

  const catSum = Object.values(cats).reduce((s, v) => s + (Number(v) || 0), 0);

  return (
    <div className="page-content" style={{ padding: '0 0 90px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4ECDC4, #44a08d)', padding: '20px 20px 24px' }}>
        <button style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', marginBottom: 4 }}>←</button>
        <h1 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 800 }}>Set Monthly Budget</h1>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Total Budget */}
        <div className="glass card-hover" style={{ borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>Monthly Budget Amount</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#6C63FF', marginBottom: 12 }}>{fmt(Number(total) || 0)}</div>
          <input className="input-field" type="number" placeholder="Enter total budget"
            value={total} onChange={e => setTotal(e.target.value)} />
          {catSum > Number(total) && (
            <p style={{ color: '#e74c3c', fontSize: 12, margin: '8px 0 0' }}>
              ⚠️ Category budgets ({fmt(catSum)}) exceed total budget
            </p>
          )}
        </div>

        {/* Category Budgets */}
        <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 16 }}>Category wise Amount</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CATEGORIES.map(cat => {
              const spent = catTotals[cat] || 0;
              const budget = Number(cats[cat]) || 0;
              const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
              const color = pct > 90 ? '#e74c3c' : pct > 75 ? '#f39c12' : '#2ecc71';
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${CATEGORY_COLORS[cat]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        {CATEGORY_ICONS[cat]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{cat}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{fmt(spent)} / {fmt(budget)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        value={cats[cat] || ''}
                        onChange={e => setCats(c => ({ ...c, [cat]: e.target.value }))}
                        style={{ width: 80, padding: '6px 10px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 13, textAlign: 'right' }}
                        placeholder="0"
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 35, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="btn-primary" onClick={handleSave}>💾 Save Budget</button>
      </div>
    </div>
  );
}
