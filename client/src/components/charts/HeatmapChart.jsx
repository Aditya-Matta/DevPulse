import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { TOPIC_COLORS } from '../../lib/constants.js';

const CustomContent = ({ x, y, width, height, name, value, root }) => {
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6} ry={6}
        style={{ fill: TOPIC_COLORS[Math.abs(name?.charCodeAt(0) || 0) % TOPIC_COLORS.length], fillOpacity: 0.85 }} />
      {width > 60 && height > 30 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle"
            fill="white" fontSize={Math.min(13, width / 8)} fontWeight={600}>
            {name?.length > 14 ? name.slice(0, 13) + '…' : name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle"
            fill="rgba(255,255,255,0.75)" fontSize={11}>
            {value}x
          </text>
        </>
      )}
    </g>
  );
};

export default function HeatmapChart({ interviews = [] }) {
  if (!interviews.length) {
    return (
      <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        No interview data yet
      </div>
    );
  }

  const topicMap = {};
  interviews.forEach((iv) => {
    iv.topics?.forEach((t) => { topicMap[t] = (topicMap[t] || 0) + 1; });
  });

  const data = Object.entries(topicMap)
    .map(([name, value]) => ({ name, size: value, value }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 30);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <Treemap
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        content={<CustomContent />}
      >
        <Tooltip
          content={({ payload }) => {
            if (!payload?.length) return null;
            const { name, value } = payload[0].payload;
            return (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <strong>{name}</strong>: {value} interview{value > 1 ? 's' : ''}
              </div>
            );
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
