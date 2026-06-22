import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e?.preventDefault();
    onLogin();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6C63FF, #a78bfa)', padding: '40px 24px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 72 }}>💼</div>
      </div>

      {/* Card */}
      <div style={{ background: '#1a1a2e', borderRadius: '24px 24px 0 0', flex: 1, marginTop: -24, padding: '32px 24px' }}>
        <h2 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: '0 0 4px', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', margin: '0 0 32px' }}>Good to see you again</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            className="input-field"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="input-field"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            type="password"
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#6C63FF' }} />
              Remember me
            </label>
            <button style={{ color: '#6C63FF', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
              Forgot password
            </button>
          </div>

          <button className="btn-primary" onClick={handleLogin} style={{ marginTop: 8 }}>
            Login
          </button>

          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            Don't have an account? <button onClick={handleLogin} style={{ color: '#6C63FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Sign up</button>
          </div>

          <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13 }}>or continue with</div>

          {/* Social login */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            {['🌐', '🍎', '📘', '🪟', '✉️'].map((icon, i) => (
              <button key={i} onClick={handleLogin} style={{
                width: 48, height: 48, borderRadius: 12,
                background: '#2d2d4e', border: 'none', fontSize: 22, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{icon}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
