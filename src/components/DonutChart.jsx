import { useMemo } from 'react';

export default function DonutChart({ data, size = 180, innerRadius = 55 }) {
  const total = data.reduce((s, d) => s + d.value, 0);

  const slices = useMemo(() => {
    let cumulative = 0;
    return data.map(d => {
      const pct = total ? d.value / total : 0;
      const start = cumulative;
      cumulative += pct;
      return { ...d, pct, start };
    });
  }, [data, total]);

  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const gap = 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {total === 0 ? (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={20} />
      ) : (
        slices.map((slice, i) => {
          const strokeDash = (slice.pct * circumference) - gap;
          const strokeOffset = circumference - slice.start * circumference;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth={20}
              strokeDasharray={`${Math.max(0, strokeDash)} ${circumference}`}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s ease', transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(-90deg)' }}
            />
          );
        })
      )}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#6C63FF" fontSize="16" fontWeight="800">
        {total > 0 ? `₹${(total / 1000).toFixed(1)}k` : '₹0'}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize="11">
        Total Spent
      </text>
    </svg>
  );
}
