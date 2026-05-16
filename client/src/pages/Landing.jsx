import { Link, useNavigate } from 'react-router-dom';
import useUIStore from '../store/uiStore.js';

const FEATURES = [
  { label: 'Interview Logger',     desc: 'Log every round — company, outcome, topics, difficulty, notes. Filter and search everything.' },
  { label: 'AI Weakness Analysis', desc: 'GPT-4o-mini reads your last 50 interviews and returns a diagnosis with a study plan for your weakest areas.' },
  { label: 'Visual Dashboard',     desc: 'Activity calendar, topic heatmap, and radar chart give you an instant read of your preparation.' },
  { label: 'Live Mock Rooms',      desc: 'Real-time collaborative code editor over Socket.io. Share a 6-char code, start practising.' },
  { label: 'Community Leaderboard', desc: 'See which companies appear most and which topics cause the most failures — across all users.' },
  { label: 'Public Prep Card',     desc: 'Your shareable /u/username page. One link shows pass rate, streak, and top topics to recruiters.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUIStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--text)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--bg)', fontSize: '0.82rem', fontWeight: 700,
          }}>D</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.05rem', color: 'var(--text)' }}>DevPulse</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-raised)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '6px 12px',
              color: 'var(--text-2)', fontSize: '0.8rem', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span>{theme === 'dark' ? '○' : '●'}</span>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <Link
            to="/login"
            style={{
              color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.875rem',
              fontWeight: 500, padding: '7px 14px', borderRadius: 'var(--r-md)',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-raised)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >Sign in</Link>
          <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero — asymmetric ────────────────────────────────────── */}
      <section style={{ padding: '96px 48px 80px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 80, alignItems: 'end' }}>
          {/* Left — headline */}
          <div className="page-enter">
            <p className="label" style={{ marginBottom: 20 }}>Interview intelligence platform</p>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
              fontWeight: 400, lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              marginBottom: 28,
            }}>
              Track every<br />
              interview.<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Land the offer.</em>
            </h1>
            <p style={{
              fontSize: '1.05rem', color: 'var(--text-2)', lineHeight: 1.7,
              maxWidth: 480, marginBottom: 40,
            }}>
              DevPulse is the focused tool developers use to log interviews, understand patterns, and turn weaknesses into strengths — with AI-powered coaching built in.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
                Start tracking free
              </button>
              <button onClick={() => navigate('/login')} className="btn btn-secondary btn-lg">
                Sign in
              </button>
            </div>
          </div>

          {/* Right — stats column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="page-enter">
            {[
              { val: '10k+', sub: 'Interviews logged' },
              { val: '3×',   sub: 'Faster improvement with AI' },
              { val: '94%',  sub: 'User satisfaction' },
            ].map(({ val, sub }) => (
              <div key={sub} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '20px 24px',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <div style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '2.2rem', color: 'var(--text)',
                  letterSpacing: '-0.03em', lineHeight: 1,
                  marginBottom: 4,
                }}>{val}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '0 48px' }} />

      {/* ── Features — staggered asymmetric grid ─────────────────── */}
      <section style={{ padding: '80px 48px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 60, marginBottom: 64 }}>
          <div>
            <p className="label" style={{ marginBottom: 12 }}>What's inside</p>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.25, color: 'var(--text)' }}>
              Everything to ace your next interview
            </h2>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.7, paddingTop: 28 }}>
            Built specifically for developers who take their job search seriously. No fluff — just the tools you need to track progress and make smarter decisions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              style={{
                background: 'var(--bg-surface)',
                padding: '32px 28px',
                borderRadius: i === 0 ? 'var(--r-lg) 0 0 0' : i === 2 ? '0 var(--r-lg) 0 0' : i === 3 ? '0 0 0 var(--r-lg)' : i === 5 ? '0 0 var(--r-lg) 0' : 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-raised)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
            >
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--accent)',
                marginBottom: 10,
              }}>0{i + 1}</div>
              <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 8, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                {f.label}
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.83rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{
        margin: '0 48px 80px',
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)',
        padding: '64px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 40,
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.025em', marginBottom: 12, lineHeight: 1.2, color: 'var(--text)' }}>
            Ready to take your prep seriously?
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Free to start. No credit card. Built for engineers who want to get better, faster.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
            Create account
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        padding: '24px 48px',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text-3)', fontSize: '0.78rem',
      }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--text-2)', fontSize: '0.9rem' }}>DevPulse</span>
        <span>© 2025 · Built for developers</span>
      </footer>
    </div>
  );
}
