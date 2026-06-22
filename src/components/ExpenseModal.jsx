import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Education', 'Entertainment', 'Health', 'Bills', 'Other'];

export default function ExpenseModal({ onClose, editExpense = null }) {
  const { dispatch, showToast, CATEGORY_ICONS } = useApp();
  const [form, setForm] = useState({
    name: '', amount: '', category: 'Food',
    date: new Date().toISOString().split('T')[0], notes: ''
  });

  useEffect(() => {
    if (editExpense) setForm({ ...editExpense, amount: String(editExpense.amount) });
  }, [editExpense]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.amount || isNaN(Number(form.amount))) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    const expense = { ...form, amount: Number(form.amount) };
    if (editExpense) {
      dispatch({ type: 'EDIT_EXPENSE', payload: { ...expense, id: editExpense.id } });
      showToast('Expense updated!');
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
      showToast('Expense added!');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--tw-prose-headings, #1a1a2e)' }}>
            {editExpense ? '✏️ Edit Expense' : '➕ Add New Expense'}
          </h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Expense Name *</label>
            <input className="input-field" placeholder="e.g Lunch, Bus Ticket" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Amount *</label>
            <input className="input-field" placeholder="e.g 360" type="number" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Category</label>
            <select className="input-field" value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Date</label>
            <input className="input-field" type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Notes (optional)</label>
            <textarea className="input-field" placeholder="Add a note..." rows={2} value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={{ resize: 'vertical', minHeight: 60 }} />
          </div>

          <button className="btn-primary" onClick={handleSubmit} style={{ marginTop: 8 }}>
            {editExpense ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
