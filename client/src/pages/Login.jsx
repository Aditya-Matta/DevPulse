import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/axios.js';
import useAuthStore from '../store/authStore.js';
import useUIStore from '../store/uiStore.js';
import Button from '../components/ui/Button.jsx';

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', data);
      login(res.data.data.user, res.data.data.accessToken);
      addNotification({ type: 'success', message: `Welcome back, ${res.data.data.user.name}` });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      addNotification({ type: 'error', message: err.response?.data?.message || 'Login failed' });
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex',
    }}>
      {/* Left panel — branding */}
      <div style={{
        width: 380, flexShrink: 0,
        background: 'var(--bg-raised)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px 44px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 48 }}>
            <div style={{ width: 28, height: 28, background: 'var(--text)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontSize: '0.82rem', fontWeight: 700 }}>D</div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.05rem' }}>DevPulse</span>
          </div>
          <h2 style={{ fontWeight: 400, fontSize: '1.6rem', letterSpacing: '-0.025em', lineHeight: 1.3, color: 'var(--text)', marginBottom: 14 }}>
            Your interview<br />intelligence hub.
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.65 }}>
            Log interviews, spot patterns, get AI coaching, and share your prep card — all in one place.
          </p>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>© 2025 DevPulse</p>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 40,
      }}>
        <div style={{ width: '100%', maxWidth: 380 }} className="page-enter">
          <h1 style={{ fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 6, color: 'var(--text)' }}>
            Sign in
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginBottom: 32 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Create one</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Email</label>
              <input id="login-email" className="input" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.email.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Password</label>
              <input id="login-password" className="input" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.password.message}</p>}
            </div>
            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', padding: '11px', marginTop: 4 }}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
