import { useEffect, useState } from 'react';
import api from '../lib/axios.js';
import Spinner from '../components/ui/Spinner.jsx';

const WARM_PALETTE = ['#4e6e41','#7a6a52','#a05c50','#4a6a7a','#8a6a3a','#5a4a7a','#6a7a4a','#7a4a6a'];

export default function Leaderboard() {
  const [companies, setCompanies] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('companies');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [cRes, tRes] = await Promise.all([
          api.get('/api/leaderboard/companies'),
          api.get('/api/leaderboard/topics'),
        ]);
        setCompanies(cRes.data.data.companies || []);
        setTopics(tRes.data.data.topics || []);
      } catch { /* ignore */ } finally { setLoading(false); }
    })();
  }, []);

  const data = activeTab === 'companies' ? companies : topics;
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const RankBadge = ({ i }) => {
    if (i === 0) return <span style={{ fontSize: '1rem' }}>🥇</span>;
    if (i === 1) return <span style={{ fontSize: '1rem' }}>🥈</span>;
    if (i === 2) return <span style={{ fontSize: '1rem' }}>🥉</span>;
    return <span style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontWeight: 600 }}>#{i+1}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div>
        <p className="label" style={{ marginBottom: 6 }}>Community</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '2rem', letterSpacing: '-0.025em', color: 'var(--text)' }}>
          Leaderboard
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginTop: 8 }}>
          Anonymised community data — top companies and most-failed topics across all DevPulse users.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'inline-flex', gap: 2,
        background: 'var(--bg-raised)', padding: 4,
        borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
        width: 'fit-content',
      }}>
        {[['companies','Top companies'],['topics','Failed topics']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '7px 18px', borderRadius: 'var(--r-sm)',
              border: 'none', cursor: 'pointer',
              background: activeTab === id ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === id ? 'var(--text)' : 'var(--text-2)',
              fontWeight: 500, fontSize: '0.83rem', fontFamily: 'inherit',
              boxShadow: activeTab === id ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s',
            }}
          >{label}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)',
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={28} /></div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)', fontSize: '0.875rem' }}>
            No data yet — log some interviews to see the leaderboard.
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '56px 1fr 120px',
              padding: '10px 24px', background: 'var(--bg-raised)',
              borderBottom: '1px solid var(--border)',
            }}>
              {['Rank', activeTab === 'companies' ? 'Company' : 'Topic', 'Count'].map(h => (
                <span key={h} className="label">{h}</span>
              ))}
            </div>

            {data.map((item, i) => {
              const label = activeTab === 'companies' ? item.company : item.topic;
              const color = WARM_PALETTE[i % WARM_PALETTE.length];
              const pct = Math.round((item.count / maxCount) * 100);
              return (
                <div
                  key={label}
                  style={{
                    display: 'grid', gridTemplateColumns: '56px 1fr 120px',
                    padding: '14px 24px', alignItems: 'center',
                    borderBottom: i < data.length-1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 28, textAlign: 'center' }}><RankBadge i={i} /></div>
                  <div style={{ minWidth: 0, paddingRight: 20 }}>
                    <div style={{
                      fontWeight: 500, color: 'var(--text)', fontSize: '0.88rem',
                      marginBottom: 6, textTransform: activeTab === 'topics' ? 'capitalize' : 'none',
                    }}>{label}</div>
                    <div style={{ height: 4, background: 'var(--bg-subtle)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                  <div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      fontSize: '0.8rem', fontWeight: 600, color,
                      background: `${color}18`,
                      padding: '3px 10px', borderRadius: 99,
                    }}>{item.count}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <p style={{ color: 'var(--text-3)', fontSize: '0.73rem', textAlign: 'center' }}>
        Anonymous aggregated data · Cached for 10 minutes
      </p>
    </div>
  );
}
