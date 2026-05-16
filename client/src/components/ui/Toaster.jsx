import useUIStore from '../../store/uiStore';

const typeConfig = {
  success: { bg: 'var(--success-bg)', color: 'var(--success)', icon: '✓' },
  error:   { bg: 'var(--danger-bg)',  color: 'var(--danger)',  icon: '✕' },
  warning: { bg: 'var(--warning-bg)', color: 'var(--warning)', icon: '!' },
  info:    { bg: 'var(--bg-raised)',  color: 'var(--text-2)',  icon: 'i' },
};

export function Toaster() {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {notifications.map((n) => {
        const cfg = typeConfig[n.type] || typeConfig.info;
        return (
          <div
            key={n.id}
            onClick={() => removeNotification(n.id)}
            className="fade-in"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', borderRadius: 'var(--r-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer', pointerEvents: 'auto',
              minWidth: 240, maxWidth: 360,
            }}
          >
            <span style={{
              width: 22, height: 22, borderRadius: '50%',
              background: cfg.bg, color: cfg.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
            }}>{cfg.icon}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>
              {n.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
