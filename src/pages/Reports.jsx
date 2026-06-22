import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DonutChart from '../components/DonutChart';
import SpendingTrendChart from '../components/SpendingTrendChart';
import { fmt } from '../utils/format';

export default function Reports() {
  const { state, totalExpenses, catTotals, CATEGORY_ICONS, CATEGORY_COLORS } = useApp();
  const [period, setPeriod] = useState('Monthly');

  const donutData = Object.entries(catTotals).map(([cat, val]) => ({
    label: cat, value: val, color: CATEGORY_COLORS[cat] || '#95a5a6'
  })).filter(d => d.value > 0);

  const topCat = Object.entries(catTotals).sort((a,b) => b[1]-a[1])[0];

  return (
    <div className="page-content" style={{ padding: '0 0 90px' }}>
      <div style={{ background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)', padding: '20px 20px 24px' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 800 }}>Report and Analytics</h1>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Period tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['Weekly','Monthly','Yearly'].map(p => (
            <button key={p} className={`chip ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>

        {/* Total Spent */}
        <div className="glass card-hover" style={{ borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Total Spent</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1a1a2e', margin: '4px 0' }}>{fmt(totalExpenses)}</div>
          <div style={{ color: '#2ecc71', fontSize: 13, fontWeight: 600 }}>↓ 12% from last month</div>
        </div>

        {/* Donut + breakdown */}
        <div className="glass card-hover" style={{ borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <DonutChart data={donutData} size={160} />
            <div style={{ flex: 1 }}>
              {donutData.map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                    <span style={{ fontSize: 12, color: '#64748b' }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>
                    {totalExpenses ? Math.round((d.value / totalExpenses) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spending Trend */}
        <div className="glass card-hover" style={{ borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#64748b' }}>📉 Spending Trend</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>This Month</span>
          </div>
          <SpendingTrendChart expenses={state.expenses} />
        </div>

        {/* Top Category */}
        {topCat && (
          <div className="glass card-hover" style={{ borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#64748b', marginBottom: 12 }}>🏆 Top Category</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${CATEGORY_COLORS[topCat[0]]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {CATEGORY_ICONS[topCat[0]]}
                </div>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{topCat[0]}</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#e74c3c' }}>{fmt(topCat[1])}</span>
            </div>
          </div>
        )}

        {/* Category breakdown */}
        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#64748b', marginBottom: 12 }}>📊 Category Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(catTotals).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => {
              const pct = totalExpenses ? Math.round((amt / totalExpenses) * 100) : 0;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 600 }}>{CATEGORY_ICONS[cat]} {cat}</span>
                    <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 700 }}>{fmt(amt)} ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] || '#6C63FF' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
