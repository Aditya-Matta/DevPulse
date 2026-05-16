import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import useUIStore from '../../store/uiStore.js';

export default function PageWrapper() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Navbar />
        <main style={{
          flex: 1,
          padding: '36px 40px',
          maxWidth: 1160,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}>
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
