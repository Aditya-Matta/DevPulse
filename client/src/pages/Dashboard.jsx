import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useInterviewStore from '../store/interviewStore.js';
import useAuthStore from '../store/authStore.js';
import HeatmapChart from '../components/charts/HeatmapChart.jsx';
import StreakCalendar from '../components/charts/StreakCalendar.jsx';
import TopicRadar from '../components/charts/TopicRadar.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const Stat = ({ label, value, sub, accent = false }) => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)', padding: '22px 24px',
    boxShadow: 'var(--shadow-xs)',
  }}>
    <p className="label" style={{ marginBottom: 10 }}>{label}</p>
    <p style={{
      fontFamily: "'DM Serif Display', serif",
      fontSize: '2.4rem', fontWeight: 400, lineHeight: 1,
      letterSpacing: '-0.03em',
      color: accent ? 'var(--accent)' : 'var(--text)',
      marginBottom: 6,
    }}>{value}</p>
    {sub && <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{sub}</p>}
  </div>
);

const SectionCard = ({ title, children }) => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)', padding: '24px 28px',
    boxShadow: 'var(--shadow-xs)',
  }}>
    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 20 }}>{title}</p>
    {children}
  </div>
);

export default function Dashboard() {
  const { user } = useAuthStore();
  const { interviews, loading, fetchInterviews } = useInterviewStore();

  useEffect(() => { fetchInterviews(1); }, []);

  const all = interviews;
  const stats = useMemo(() => {
    const total = all.length;
    const passed = all.filter(i => i.outcome === 'Passed').length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const failedTopics = {};
    all.filter(i => i.outcome === 'Failed').forEach(i => {
      i.topics?.forEach(t => { failedTopics[t] = (failedTopics[t] || 0) + 1; });
    });
    const topFailing = Object.entries(failedTopics).sort((a,b) => b[1]-a[1])[0]?.[0] || '—';
    return { total, passRate, topFailing, streak: user?.streakCount || 0 };
  }, [all, user]);

  const recent = [...all].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,5);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (loading && !all.length) {
    return <div style={{ display:'flex', justifyContent:'center', padding: 80 }}><Spinner size={32}/></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="label" style={{ marginBottom: 6 }}>Overview</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '2rem', letterSpacing: '-0.025em', color: 'var(--text)' }}>
            {greeting}, {user?.name?.split(' ')[0]}.
          </h1>
        </div>
        <Link to="/interviews/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          + Log interview
        </Link>
      </div>

      {/* Stats — asymmetric 4-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.9fr', gap: 14 }}>
        <Stat label="Total Interviews" value={stats.total} sub="Across all companies" />
        <Stat label="Pass Rate"        value={`${stats.passRate}%`} sub={`${all.filter(i=>i.outcome==='Passed').length} passed`} accent />
        <Stat label="Weak Area"        value={stats.topFailing} sub="Most failed topic" />
        <Stat label="Streak"           value={`${stats.streak}d`} sub="Keep going" />
      </div>

      {/* Charts row — unequal columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        <SectionCard title="Activity Calendar">
          <StreakCalendar interviews={all} />
        </SectionCard>
        <SectionCard title="Topic Radar">
          <TopicRadar interviews={all} />
        </SectionCard>
      </div>

      {/* Heatmap full width */}
      <SectionCard title="Topic Heatmap">
        <HeatmapChart interviews={all} />
      </SectionCard>

      {/* Recent — table style */}
      <SectionCard title="Recent activity">
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>
            <p style={{ marginBottom: 12, fontSize: '0.9rem' }}>No interviews yet</p>
            <Link to="/interviews/new" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>
              Log your first interview →
            </Link>
          </div>
        ) : recent.map((iv, i) => {
          const dotColor = { Passed: 'var(--success)', Failed: 'var(--danger)', Pending: 'var(--warning)' }[iv.outcome];
          return (
            <div key={iv._id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 0',
              borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 500, color: 'var(--text)', fontSize: '0.875rem' }}>{iv.company}</span>
                <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}> · {iv.role} · {iv.round}</span>
              </div>
              <span style={{ color: dotColor, fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{iv.outcome}</span>
              <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', flexShrink: 0 }}>{new Date(iv.date).toLocaleDateString()}</span>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}
