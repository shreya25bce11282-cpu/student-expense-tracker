export default function Splash({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #6C63FF 0%, #a78bfa 50%, #4ECDC4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', color: 'white', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))' }}>💰</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
        Student Expense &<br />
        <span style={{ color: '#ffd700' }}>Budget Tracker</span>
      </h1>
      <p style={{ fontSize: 16, opacity: 0.85, margin: '0 0 48px', lineHeight: 1.6 }}>
        Track. Plan. Save.<br />Achieve your goals!
      </p>
      <div style={{ fontSize: 120, marginBottom: 48 }}>🎓</div>
      <button className="btn-primary" onClick={onStart} style={{ background: 'white', color: '#6C63FF', width: 'auto', padding: '16px 48px', borderRadius: '50px', fontSize: 18 }}>
        Get Started →
      </button>
    </div>
  );
}
