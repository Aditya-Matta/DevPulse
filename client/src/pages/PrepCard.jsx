import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios.js';
import Avatar from '../components/ui/Avatar.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import useUIStore from '../store/uiStore.js';

export default function PrepCard() {
  const { username } = useParams();
  const { addNotification } = useUIStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `@${username} · DevPulse`;
    (async () => {
      try {
        const res = await api.get(`/api/users/${username}/prepcard`);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'User not found');
      } finally { setLoading(false); }
    })();
  }, [username]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification({ type: 'success', message: 'Link copied' });
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <Spinner size={36} />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, background: 'var(--bg)' }}>
      <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--text)' }}>User not found</p>
      <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>{error}</p>
      <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: 8 }}>← Go home</button>
    </div>
  );

  const { user, stats } = data;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, background: 'var(--text)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontSize: '0.8rem', fontWeight: 700 }}>D</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem' }}>DevPulse</span>
        </div>
        <button onClick={copyLink} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>Copy link</button>
      </nav>

      {/* Card — centered, constrained */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div
          className="page-enter"
          style={{
            width: '100%', maxWidth: 520,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Top stripe */}
          <div style={{ height: 6, background: 'var(--accent)' }} />

          {/* Profile area */}
          <div style={{ padding: '32px 36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <Avatar name={user.name} avatarUrl={user.avatarUrl} size={60} />
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.2 }}>
                  {user.name}
                </h1>
                <p style={{ color: 'var(--text-3)', fontSize: '0.82rem', marginTop: 2 }}>
                  @{user.username} · Member since {new Date(user.memberSince).getFullYear()}
                </p>
              </div>
            </div>

            <hr className="divider" style={{ marginBottom: 24 }} />

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
              {[
                { label: 'Interviews', value: stats.totalInterviews },
                { label: 'Pass rate',  value: `${stats.passRate}%` },
                { label: 'Streak',     value: `${user.streakCount || 0}d` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'var(--bg-raised)', borderRadius: 'var(--r-md)',
                  padding: '16px', textAlign: 'center', border: '1px solid var(--border)',
                }}>
                  <div style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '1.8rem', fontWeight: 400, color: 'var(--text)',
                    letterSpacing: '-0.025em', lineHeight: 1,
                  }}>{value}</div>
                  <div className="label" style={{ marginTop: 5 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Topics */}
            {stats.top5Topics?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p className="label" style={{ marginBottom: 10 }}>Top topics</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {stats.top5Topics.map(({ topic, count }) => (
                    <span key={topic} className="tag" style={{ textTransform: 'capitalize' }}>
                      {topic} <span style={{ color: 'var(--text-3)', marginLeft: 2 }}>{count}×</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <hr className="divider" style={{ marginBottom: 20 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>devpulse.app/u/{user.username}</span>
              <button onClick={copyLink} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '7px 16px' }}>
                Share card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
