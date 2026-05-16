import { useNavigate } from 'react-router-dom';
import useUIStore from '../../store/uiStore.js';
import useAuthStore from '../../store/authStore.js';
import Avatar from '../ui/Avatar.jsx';

export default function Navbar() {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }); };

  return (
    <header style={{
      height: 54,
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Left */}
      <button
        onClick={toggleSidebar}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-3)', padding: '5px 7px', borderRadius: 'var(--r-sm)',
          transition: 'background 0.15s, color 0.15s', lineHeight: 1,
          fontSize: '0.95rem',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-raised)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-3)'; }}
        title="Toggle sidebar"
      >☰</button>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: '5px 10px',
            cursor: 'pointer', color: 'var(--text-2)',
            fontSize: '0.82rem', fontWeight: 500,
            fontFamily: 'inherit', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <span>{theme === 'dark' ? '○' : '●'}</span>
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Streak */}
        {user && (
          <div style={{
            fontSize: '0.8rem', color: 'var(--text-2)',
            background: 'var(--warning-bg)',
            border: '1px solid var(--border)',
            padding: '4px 10px', borderRadius: 'var(--r-md)',
            fontWeight: 500,
          }}>
            🔥 {user.streakCount || 0}d
          </div>
        )}

        {/* Avatar */}
        {user && <Avatar name={user.name} avatarUrl={user.avatarUrl} size={28} />}
      </div>
    </header>
  );
}
