import { useMemo } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function TopicRadar({ interviews = [] }) {
  const data = useMemo(() => {
    const map = {};
    interviews.forEach((iv) => {
      iv.topics?.forEach((t) => {
        if (!map[t]) map[t] = { topic: t, passed: 0, failed: 0 };
        if (iv.outcome === 'Passed') map[t].passed++;
        else if (iv.outcome === 'Failed') map[t].failed++;
      });
    });
    return Object.values(map)
      .sort((a, b) => (b.passed + b.failed) - (a.passed + a.failed))
      .slice(0, 8);
  }, [interviews]);

  if (!data.length) {
    return (
      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '0.83rem' }}>
        No topic data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" strokeOpacity={0.8} />
        <PolarAngleAxis dataKey="topic" tick={{ fill: 'var(--text-2)', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }} />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar name="Passed" dataKey="passed" stroke="#3d7554" fill="#3d7554" fillOpacity={0.15} strokeWidth={1.5} />
        <Radar name="Failed" dataKey="failed" stroke="#a84c42" fill="#a84c42" fillOpacity={0.15} strokeWidth={1.5} />
        <Legend wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-2)', fontFamily: 'DM Sans, sans-serif' }} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 8, fontSize: '0.78rem', color: 'var(--text)',
            boxShadow: 'var(--shadow-md)', fontFamily: 'DM Sans, sans-serif',
          }}
          labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
