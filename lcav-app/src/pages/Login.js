import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #071220 0%, #0b1a2e 50%, #0f2540 100%)',
      padding: 20,
    }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,90,171,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,90,171,0.06) 0%, transparent 70%)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-bright) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: 'white',
            boxShadow: '0 8px 32px rgba(26,90,171,0.4)',
          }}>LC</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>LCAV Vereinsportal</h1>
          <p style={{ color: 'var(--grey-400)', fontSize: 13, marginTop: 4 }}>Leichtathletik Club Attnang Vöcklabruck</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.3)',
          borderRadius: 'var(--radius-lg)', padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>Anmelden</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--grey-400)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="deine@email.at"
                required
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(26,90,171,0.3)',
                  borderRadius: 8, color: 'white', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--grey-400)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Passwort</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '10px 40px 10px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(26,90,171,0.3)',
                    borderRadius: 8, color: 'white', fontSize: 14, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                }}>
                  {showPw ? <EyeOff size={16} color="var(--grey-400)" /> : <Eye size={16} color="var(--grey-400)" />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, marginBottom: 16 }}>
                <AlertCircle size={14} color="#f87171" />
                <span style={{ fontSize: 13, color: '#f87171' }}>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px', borderRadius: 8,
              background: loading ? 'var(--navy-light)' : 'linear-gradient(135deg, var(--blue) 0%, var(--blue-bright) 100%)',
              border: 'none', color: 'white', fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em',
              transition: 'opacity 0.2s',
            }}>
              {loading ? 'Anmelden…' : <><LogIn size={16} /> Anmelden</>}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: 14, background: 'rgba(26,90,171,0.08)', borderRadius: 8, border: '1px solid rgba(26,90,171,0.15)' }}>
            <p style={{ fontSize: 11, color: 'var(--grey-400)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Demo-Zugänge (Passwort: lcav2026)</p>
            {[
              { email: 'walterr@lcav-jodl.at',  role: 'Vorstand' },
              { email: 'thomas.regl@lcav.at',    role: 'Trainer U16' },
              { email: 'lena.mayr@lcav.at',      role: 'Mitglied U16' },
            ].map(u => (
              <button key={u.email} onClick={() => { setEmail(u.email); setPassword('lcav2026'); }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '4px 0', background: 'none', border: 'none',
                color: 'var(--blue-light)', fontSize: 12, cursor: 'pointer',
              }}>
                {u.email} <span style={{ color: 'var(--grey-600)' }}>· {u.role}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--grey-600)', marginTop: 20 }}>
          © 2026 LCAV Jodl Packaging · Attnang-Puchheim
        </p>
      </div>
    </div>
  );
}
