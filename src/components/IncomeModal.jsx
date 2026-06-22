import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function IncomeModal({ onClose }) {
  const { dispatch, showToast, state } = useApp();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('add'); // 'add' or 'set'

  const handleSubmit = () => {
    const val = Number(amount);
    if (!val || isNaN(val) || val <= 0) { showToast('Enter a valid amount', 'error'); return; }
    if (mode === 'add') dispatch({ type: 'ADD_INCOME', payload: val });
    else dispatch({ type: 'SET_INCOME', payload: val });
    showToast(`Income ${mode === 'add' ? 'added' : 'updated'}!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>💰 Add Income</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['add','set'].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`chip ${mode === m ? 'active' : ''}`}>
              {m === 'add' ? '+ Add to Income' : '= Set Income'}
            </button>
          ))}
        </div>

        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>
          Current income: <strong>₹{state.income.toLocaleString('en-IN')}</strong>
        </p>

        <input className="input-field" placeholder="Enter amount" type="number"
          value={amount} onChange={e => setAmount(e.target.value)} style={{ marginBottom: 16 }} />

        <button className="btn-primary" onClick={handleSubmit}>
          {mode === 'add' ? 'Add Income' : 'Set Income'}
        </button>
      </div>
    </div>
  );
}
