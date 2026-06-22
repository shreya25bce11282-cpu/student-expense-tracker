import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const AppContext = createContext();

const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚌', Shopping: '🛍️',
  Education: '📚', Entertainment: '🎮', Health: '💊',
  Bills: '📄', Other: '📦'
};

const CATEGORY_COLORS = {
  Food: '#FF6B6B', Transport: '#4ECDC4', Shopping: '#a78bfa',
  Education: '#3498db', Entertainment: '#f39c12', Health: '#2ecc71',
  Bills: '#e74c3c', Other: '#95a5a6'
};

const initialState = {
  user: { name: 'Rohit', email: 'RohitSarma624@gmail.com', branch: 'BTech Computer Science', college: 'VIT University', avatar: '👨‍💻' },
  income: 15000,
  totalBudget: 10000,
  categoryBudgets: {
    Food: 3000, Transport: 2000, Shopping: 2000,
    Education: 2000, Entertainment: 1000
  },
  expenses: [
    { id: 1, name: 'Lunch', category: 'Food', amount: 250, date: '2026-06-20', notes: '' },
    { id: 2, name: 'Bus Pass', category: 'Transport', amount: 800, date: '2026-06-19', notes: '' },
    { id: 3, name: 'Books', category: 'Education', amount: 1000, date: '2026-06-18', notes: 'Semester books' },
    { id: 4, name: 'T-Shirt', category: 'Shopping', amount: 1700, date: '2026-06-17', notes: '' },
    { id: 5, name: 'Movie', category: 'Entertainment', amount: 500, date: '2026-06-16', notes: '' },
    { id: 6, name: 'Dinner', category: 'Food', amount: 400, date: '2026-06-15', notes: '' },
    { id: 7, name: 'Groceries', category: 'Food', amount: 1200, date: '2026-06-14', notes: '' },
    { id: 8, name: 'Cab', category: 'Transport', amount: 350, date: '2026-06-13', notes: '' },
  ],
  notifications: [],
  savingsGoal: 5000,
  achievements: {
    budgetMaster: false, saver: false, consistentTracker: false, smartSpender: false
  },
  streak: 0,
  lastActiveDate: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newExp = { ...action.payload, id: Date.now() };
      const updated = { ...state, expenses: [newExp, ...state.expenses] };
      return generateAlerts(updated);
    }
    case 'EDIT_EXPENSE': {
      const updated = {
        ...state,
        expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e)
      };
      return generateAlerts(updated);
    }
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'SET_BUDGET':
      return generateAlerts({ ...state, totalBudget: action.payload.total, categoryBudgets: action.payload.categories });
    case 'SET_INCOME':
      return { ...state, income: action.payload };
    case 'ADD_INCOME':
      return { ...state, income: state.income + action.payload };
    case 'SET_SAVINGS_GOAL':
      return { ...state, savingsGoal: action.payload };
    case 'MARK_NOTIFICATION_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'UPDATE_STREAK':
      return { ...state, streak: action.payload.streak, lastActiveDate: action.payload.date };
    case 'UPDATE_ACHIEVEMENTS':
      return { ...state, achievements: { ...state.achievements, ...action.payload } };
    case 'GENERATE_ALERT': {
      const exists = state.notifications.some(n => n.key === action.payload.key);
      if (exists) return state;
      return { ...state, notifications: [action.payload, ...state.notifications] };
    }
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

function generateAlerts(state) {
  let newState = { ...state };
  const catTotals = {};
  state.expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });

  Object.entries(state.categoryBudgets).forEach(([cat, budget]) => {
    const spent = catTotals[cat] || 0;
    const pct = (spent / budget) * 100;
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (pct >= 100) {
      const key = `${cat}_overspent_${Math.floor(pct / 10)}`;
      const exists = newState.notifications.some(n => n.key === key);
      if (!exists) {
        newState.notifications = [{
          id: Date.now() + Math.random(), key, type: 'danger',
          title: 'Budget Exceeded', message: `${cat} budget has been exceeded!`, time: ts, read: false
        }, ...newState.notifications];
      }
    } else if (pct >= 90) {
      const key = `${cat}_danger_${Math.floor(pct / 5)}`;
      const exists = newState.notifications.some(n => n.key === key);
      if (!exists) {
        newState.notifications = [{
          id: Date.now() + Math.random(), key, type: 'warning',
          title: 'Budget Alert', message: `You have spent 90% of your ${cat} budget.`, time: ts, read: false
        }, ...newState.notifications];
      }
    } else if (pct >= 80) {
      const key = `${cat}_warning_${Math.floor(pct / 10)}`;
      const exists = newState.notifications.some(n => n.key === key);
      if (!exists) {
        newState.notifications = [{
          id: Date.now() + Math.random(), key, type: 'info',
          title: 'Budget Alert', message: `You have spent 80% of your ${cat} budget.`, time: ts, read: false
        }, ...newState.notifications];
      }
    }
  });
  return newState;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('expenseTrackerState');
    if (saved) {
      try { dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) }); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenseTrackerState', JSON.stringify(state));
    // Check achievements
    const totalExpenses = state.expenses.reduce((s, e) => s + e.amount, 0);
    const savings = state.income - totalExpenses;
    const catTotals = {};
    state.expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
    const allUnder80 = Object.entries(state.categoryBudgets).every(([cat, b]) => ((catTotals[cat] || 0) / b) < 0.8);
    dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: {
      saver: savings >= state.savingsGoal,
      budgetMaster: totalExpenses <= state.totalBudget,
      smartSpender: allUnder80,
    }});
  }, [state.expenses, state.categoryBudgets, state.totalBudget, state.income]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Update streak
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const streak = state.lastActiveDate === yesterday.toDateString() ? state.streak + 1 : 1;
      dispatch({ type: 'UPDATE_STREAK', payload: { streak, date: today } });
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const totalExpenses = state.expenses.reduce((s, e) => s + e.amount, 0);
  const savings = state.income - totalExpenses;
  const remaining = state.totalBudget - totalExpenses;

  const catTotals = {};
  state.expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });

  const healthScore = (() => {
    let score = 100;
    if (totalExpenses > state.totalBudget) score -= Math.min(40, ((totalExpenses - state.totalBudget) / state.totalBudget) * 40);
    const utilization = totalExpenses / state.totalBudget;
    if (utilization > 0.9) score -= 15;
    else if (utilization > 0.75) score -= 8;
    if (savings >= state.savingsGoal) score += 5;
    return Math.max(0, Math.min(100, Math.round(score)));
  })();

  const healthStatus = healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : healthScore >= 50 ? 'Fair' : 'Risky';
  const healthColor = healthScore >= 90 ? '#2ecc71' : healthScore >= 70 ? '#4ECDC4' : healthScore >= 50 ? '#f39c12' : '#e74c3c';

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dayOfMonth = today.getDate();
  const avgDailySpend = totalExpenses / dayOfMonth;
  const forecast = avgDailySpend * daysInMonth;
  const forecastSavings = state.income - forecast;

  return (
    <AppContext.Provider value={{
      state, dispatch, theme, setTheme, toast, showToast,
      totalExpenses, savings, remaining, catTotals,
      healthScore, healthStatus, healthColor,
      forecast, forecastSavings, avgDailySpend,
      CATEGORY_ICONS, CATEGORY_COLORS,
    }}>
      {children}
      {toast && (
        <div className="toast" style={{
          background: toast.type === 'success' ? '#2ecc71' : toast.type === 'error' ? '#e74c3c' : '#6C63FF',
          color: 'white'
        }}>
          {toast.msg}
        </div>
      )}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
export { CATEGORY_ICONS, CATEGORY_COLORS };
