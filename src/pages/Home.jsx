import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DonutChart from '../components/DonutChart';
import AnimatedCounter from '../components/AnimatedCounter';
import ExpenseModal from '../components/ExpenseModal';
import IncomeModal from '../components/IncomeModal';
import { generateInsights } from '../utils/insights';
import { fmt, fmtDate } from '../utils/format';

export default function Home({ setActive }) {
  const { state, dispatch, showToast, totalExpenses, savings, remaining, catTotals, healthScore, healthStatus, healthColor, forecast, forecastSavings, CATEGORY_ICONS, CATEGORY_COLORS } = useApp();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [editExp, setEditExp] = useState(null);

  const insights = useMemo(() =>
    generateInsights(state, catTotals, totalExpenses, savings, forecast),
    [state, catTotals, totalExpenses, savings, forecast]
  );

  const topInsight = insights[0];
  const budgetPct = Math.min(100, Math.round((totalExpenses / state.totalBudget) * 100));

  const donutData = Object.entries(catTotals).map(([cat, val]) => ({
    label: cat, value: val, color: CATEGORY_COLORS[cat] || '#95a5a6'
  }));

  const savingsPct = Math.min(100, Math.round((savings / state.savingsGoal) * 100));
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const forecastStatus = forecast <= state.income ? 'On Track' : forecast <= state.income * 1.1 ? 'At Risk' : 'Likely Overspend';
  const forecastColor = forecastStatus === 'On Track' ? '#2ecc71' : forecastStatus === 'At Risk' ? '#f39c12' : '#e74c3c';

  const recentExpenses = state.expenses.slice(0, 5);

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    showToast('Expense deleted');
  };

  return (
    <div className="page-content" style={{ padding: '0 0 90px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #a78bfa 100%)', padding: '20px 20px 80px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 13 }}>Hi, {state.user.name} 👋</p>
            <h2 style={{ color: 'white', margin: '4px 0 0', fontSize: 18, fontWeight: 700 }}>Let's manage your finances</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setActive('notifications')}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10, padding: 8, color: 'white', cursor: 'pointer', fontSize: 18, position: 'relative' }}>
              🔔
              {state.notifications.filter(n => !n.read).length > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#e74c3c', borderRadius: '50%' }} />
              )}
            </button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {state.user.avatar}
            </div>
          </div>
        </div>

        {/* Monthly Budget Card */}
        <div className="glass" style={{ borderRadius: 16, padding: '20px', marginTop: 20, marginBottom: -60, position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>Total Budget</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>Remaining</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-primary)', fontSize: 26, fontWeight: 800 }}>
              <AnimatedCounter value={state.totalBudget} />
            </span>
            <span style={{ color: '#4ECDC4', fontSize: 22, fontWeight: 700 }}>
              <AnimatedCounter value={remaining} />
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width: `${budgetPct}%`,
              background: budgetPct > 90 ? '#e74c3c' : budgetPct > 75 ? '#f39c12' : '#6C63FF'
            }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '6px 0 0' }}>{budgetPct}% Used</p>
        </div>
      </div>

      <div style={{ padding: '72px 16px 0' }}>
        {/* Smart Insight */}
        {topInsight && (
          <div className="glass card-hover fade-in-up" style={{
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            borderLeft: `4px solid ${topInsight.type === 'danger' ? '#e74c3c' : topInsight.type === 'warning' ? '#f39c12' : '#6C63FF'}`
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>💡 SMART INSIGHT</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{topInsight.text}</p>
          </div>
        )}

        {/* Monthly Summary */}
        <div className="glass card-hover" style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>📅 This Month</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Income', value: state.income, color: '#2ecc71' },
              { label: 'Expenses', value: totalExpenses, color: '#e74c3c' },
              { label: 'Savings', value: savings, color: '#6C63FF' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', padding: '10px 4px', background: `${item.color}15`, borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                  <AnimatedCounter value={item.value} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut + Legend */}
        <div className="glass card-hover" style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)' }}>📊 Expense Overview</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>This Month</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <DonutChart data={donutData} size={160} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {donutData.slice(0, 5).map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health + Savings row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* Health */}
          <div className="glass card-hover" style={{ borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>💚 Financial Health</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: healthColor }}>
              <AnimatedCounter value={healthScore} prefix="" />
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/100</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: healthColor, borderRadius: 6, padding: '2px 8px', display: 'inline-block', marginTop: 4 }}>
              {healthStatus}
            </span>
          </div>

          {/* Savings Goal */}
          <div className="glass card-hover" style={{ borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>🎯 Savings Goal</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#6C63FF' }}>
              <AnimatedCounter value={savings} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0' }}>of {fmt(state.savingsGoal)}</div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${savingsPct}%`, background: '#6C63FF' }} />
            </div>
            <div style={{ fontSize: 11, color: '#6C63FF', marginTop: 4, fontWeight: 600 }}>{savingsPct}%</div>
          </div>
        </div>

        {/* Forecast */}
        <div className="glass card-hover" style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>📈 Spending Forecast</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expected Spending</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(forecast)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expected Savings</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: forecastSavings >= 0 ? '#2ecc71' : '#e74c3c' }}>
                {fmt(forecastSavings)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, padding: '6px 12px', borderRadius: 8, background: `${forecastColor}20`, display: 'inline-block' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: forecastColor }}>● {forecastStatus}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass" style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>⚡ Quick Action</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Add Expense', icon: '➕', color: '#6C63FF', action: () => setShowAddExpense(true) },
              { label: 'Add Income', icon: '💰', color: '#2ecc71', action: () => setShowAddIncome(true) },
              { label: 'View Report', icon: '📊', color: '#4ECDC4', action: () => setActive('reports') },
              { label: 'Set Budget', icon: '💼', color: '#f39c12', action: () => setActive('budget') },
            ].map(a => (
              <button key={a.label} onClick={a.action} style={{
                background: `${a.color}15`, border: `2px solid ${a.color}30`, borderRadius: 12,
                padding: '10px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4, transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: a.color, textAlign: 'center', lineHeight: 1.2 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="glass" style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)' }}>🧾 Recent Expenses</span>
            <button onClick={() => setActive('expenses')} style={{ fontSize: 12, color: '#6C63FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>See All</button>
          </div>

          {recentExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40 }}>📭</div>
              <p style={{ margin: '8px 0 0', fontSize: 13 }}>No expenses yet.<br />Tap + to add your first expense.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentExpenses.map(exp => (
                <div key={exp.id} className="card-hover" style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', background: 'var(--card-bg)', borderRadius: 12
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: `${CATEGORY_COLORS[exp.category] || '#6C63FF'}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                  }}>
                    {CATEGORY_ICONS[exp.category] || '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmtDate(exp.date)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#e74c3c', fontSize: 14 }}>-{fmt(exp.amount)}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <button onClick={() => setEditExp(exp)} style={{ fontSize: 12, color: '#6C63FF', background: '#6C63FF15', border: 'none', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(exp.id)} style={{ fontSize: 12, color: '#e74c3c', background: '#e74c3c15', border: 'none', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}>Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ background: 'linear-gradient(135deg, #f39c12, #e74c3c)', borderRadius: 20, padding: '10px 20px', color: 'white', fontWeight: 700, fontSize: 14 }}>
            🔥 Current Streak: {state.streak} {state.streak === 1 ? 'Day' : 'Days'}
          </div>
        </div>
      </div>

      {showAddExpense && <ExpenseModal onClose={() => setShowAddExpense(false)} />}
      {showAddIncome && <IncomeModal onClose={() => setShowAddIncome(false)} />}
      {editExp && <ExpenseModal onClose={() => setEditExp(null)} editExpense={editExp} />}
    </div>
  );
}
