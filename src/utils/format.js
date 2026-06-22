export const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
