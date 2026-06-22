import { useMemo } from 'react';

export default function SpendingTrendChart({ expenses }) {
  const data = useMemo(() => {
    const days = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      days[key] = { label, amount: 0 };
    }
    expenses.forEach(e => {
      if (days[e.date]) days[e.date].amount += e.amount;
    });
    return Object.values(days);
  }, [expenses]);

  const max = Math.max(...data.map(d => d.amount), 500);
  const W = 280, H = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (W - 20) + 10;
    const y = H - (d.amount / max) * (H - 20) - 10;
    return { x, y, ...d };
  });

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`} style={{ display: 'block', margin: '0 auto' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <path d={path} fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#6C63FF" />
            <text x={p.x} y={H + 16} textAnchor="middle" fontSize="9" fill="#94a3b8">{p.label.split(' ')[0]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
