import { NavLink, useNavigate } from 'react-router-dom';
import useUIStore from '../../store/uiStore.js';
import useAuthStore from '../../store/authStore.js';
import Avatar from '../ui/Avatar.jsx';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',     icon: '▦' },
  { to: '/interviews',   label: 'Interview Log',  icon: '◈' },
  { to: '/interviews/new', label: 'Log Interview', icon: '+' },
  { to: '/ai-analysis',  label: 'AI Analysis',    icon: '◆' },
  { to: '/mock-room',    label: 'Mock Room',      icon: '⬡' },
  { to: '/leaderboard',  label: 'Leaderboard',    icon: '◇' },
];

export default function Sidebar() {
  const { sidebarOpen, theme, toggleTheme } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }); };

  if (!sidebarOpen) return null;

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '0 10px',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 10px 16px',
        borderBottom: '1px solid var(--border)',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'var(--text)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--bg)', fontSize: '0.85rem', fontWeight: 700,
            letterSpacing: '-0.02em', flexShrink: 0,
          }}>D</div>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '1.05rem', fontWeight: 400,
            color: 'var(--text)', letterSpacing: '-0.01em',
          }}>DevPulse</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 0' }}>
        <p className="label" style={{ padding: '10px 12px 6px' }}>Menu</p>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span style={{ fontSize: '0.8rem', width: 16, textAlign: 'center', flexShrink: 0, fontFamily: 'monospace' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 0',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 'var(--r-md)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-2)', fontSize: '0.83rem', fontWeight: 500,
            fontFamily: 'inherit', width: '100%', transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-raised)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-2)'; }}
        >
          <span style={{ fontSize: '0.9rem' }}>{theme === 'dark' ? '○' : '●'}</span>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {/* User row */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px' }}>
            <NavLink to={`/u/${user.username}`} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, textDecoration: 'none', minWidth: 0 }}>
              <Avatar name={user.name} avatarUrl={user.avatarUrl} size={28} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>@{user.username}</div>
              </div>
            </NavLink>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-3)', fontSize: '0.85rem', padding: '4px 6px',
                borderRadius: 'var(--r-sm)', transition: 'color 0.15s, background 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'none'; }}
            >⇥</button>
          </div>
        )}
      </div>
    </aside>
  );
}
