import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ExpenseModal from '../components/ExpenseModal';
import { fmt, fmtDate } from '../utils/format';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Education', 'Entertainment', 'Health', 'Bills', 'Other'];

export default function Expenses() {
  const { state, dispatch, showToast, CATEGORY_ICONS, CATEGORY_COLORS } = useApp();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editExp, setEditExp] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    return state.expenses.filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'All' || e.category === filterCat;
      const matchFrom = !dateFrom || e.date >= dateFrom;
      const matchTo = !dateTo || e.date <= dateTo;
      return matchSearch && matchCat && matchFrom && matchTo;
    });
  }, [state.expenses, search, filterCat, dateFrom, dateTo]);

  const handleDelete = (id) => {
    if (confirm('Delete this expense?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      showToast('Expense deleted');
    }
  };

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="page-content" style={{ padding: '0 0 90px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6C63FF, #a78bfa)', padding: '20px 20px 24px' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 800 }}>Expenses</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', fontSize: 14 }}>
          {filtered.length} expense{filtered.length !== 1 ? 's' : ''} · {fmt(totalFiltered)}
        </p>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
          <input
            className="input-field"
            placeholder="Search expenses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`chip ${filterCat === cat ? 'active' : ''}`}
              onClick={() => setFilterCat(cat)} style={{ flexShrink: 0 }}>
              {cat !== 'All' ? CATEGORY_ICONS[cat] + ' ' : ''}{cat}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <input className="input-field" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ fontSize: 13 }} />
          <input className="input-field" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ fontSize: 13 }} />
        </div>

        {/* Add button */}
        <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ marginBottom: 16 }}>
          + Add New Expense
        </button>

        {/* Expense list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
            <div style={{ fontSize: 56 }}>📭</div>
            <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 600 }}>No expenses yet.</p>
            <p style={{ margin: '4px 0 0', fontSize: 13 }}>Tap + to add your first expense.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(exp => (
              <div key={exp.id} className="glass card-hover slide-in" style={{ borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${CATEGORY_COLORS[exp.category] || '#6C63FF'}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                }}>
                  {CATEGORY_ICONS[exp.category] || '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    {exp.category} · {fmtDate(exp.date)}
                    {exp.notes && <span> · {exp.notes}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, color: '#e74c3c', fontSize: 16 }}>-{fmt(exp.amount)}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <button onClick={() => setEditExp(exp)} aria-label="Edit expense"
                      style={{ fontSize: 13, color: '#6C63FF', background: '#6C63FF15', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(exp.id)} aria-label="Delete expense"
                      style={{ fontSize: 13, color: '#e74c3c', background: '#e74c3c15', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <ExpenseModal onClose={() => setShowAdd(false)} />}
      {editExp && <ExpenseModal onClose={() => setEditExp(null)} editExpense={editExp} />}
    </div>
  );
}
