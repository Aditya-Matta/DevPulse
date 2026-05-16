import { useMemo } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StreakCalendar({ interviews = [] }) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const end = new Date(today);
    const start = new Date(today);
    start.setDate(start.getDate() - 364);

    // Build date → count map
    const countMap = {};
    interviews.forEach((iv) => {
      const d = new Date(iv.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      countMap[key] = (countMap[key] || 0) + 1;
    });

    // Build weeks (Sun-Sat columns)
    const weeks = [];
    let cur = new Date(start);
    // Align to Sunday
    cur.setDate(cur.getDate() - cur.getDay());

    while (cur <= end) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const copy = new Date(cur);
        const key = `${copy.getFullYear()}-${copy.getMonth()}-${copy.getDate()}`;
        const count = countMap[key] || 0;
        const inRange = copy >= start && copy <= today;
        week.push({ date: new Date(copy), count, inRange, key });
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
    }

    // Month labels
    const monthLabels = [];
    weeks.forEach((week, i) => {
      const firstDay = week[0].date;
      if (firstDay.getDate() <= 7) {
        monthLabels.push({ col: i, label: MONTHS[firstDay.getMonth()] });
      }
    });

    return { weeks, monthLabels };
  }, [interviews]);

  const getColor = (count, inRange) => {
    if (!inRange) return 'transparent';
    if (count === 0) return 'var(--border)';
    if (count === 1) return 'rgba(124,58,237,0.35)';
    if (count === 2) return 'rgba(124,58,237,0.55)';
    if (count === 3) return 'rgba(124,58,237,0.75)';
    return 'var(--accent)';
  };

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      {/* Month labels */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 4, paddingLeft: 28 }}>
        {weeks.map((_, i) => {
          const label = monthLabels.find((m) => m.col === i);
          return (
            <div key={i} style={{ width: 13, flexShrink: 0, fontSize: 10, color: 'var(--text-muted)', overflow: 'visible', whiteSpace: 'nowrap' }}>
              {label?.label || ''}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', gap: 2 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 4, paddingTop: 2 }}>
          {DAYS.map((d, i) => (
            <div key={d} style={{ height: 13, width: 20, fontSize: 10, color: 'var(--text-muted)', lineHeight: '13px', textAlign: 'right', display: i % 2 === 0 ? 'none' : 'block' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((cell) => (
              <div
                key={cell.key}
                title={`${cell.date.toDateString()}${cell.count ? `: ${cell.count} interview${cell.count > 1 ? 's' : ''}` : ''}`}
                style={{
                  width: 13, height: 13, borderRadius: 3,
                  background: getColor(cell.count, cell.inRange),
                  transition: 'transform 0.1s ease',
                  cursor: cell.count > 0 ? 'pointer' : 'default',
                }}
                onMouseEnter={e => { if (cell.count > 0) e.target.style.transform = 'scale(1.3)'; }}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Less</span>
        {[0, 1, 2, 3, 4].map((v) => (
          <div key={v} style={{ width: 13, height: 13, borderRadius: 3, background: getColor(v, true) }} />
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>More</span>
      </div>
    </div>
  );
}
