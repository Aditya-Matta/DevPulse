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
  name:     z.string().min(2, 'Min 2 characters'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only'),
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', data);
      login(res.data.data.user, res.data.data.accessToken);
      addNotification({ type: 'success', message: `Welcome, ${res.data.data.user.name}!` });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      addNotification({ type: 'error', message: err.response?.data?.message || 'Registration failed' });
    } finally { setLoading(false); }
  };

  const F = ({ id, label, type='text', placeholder, name, error, hint }) => (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{label}</label>
      <input id={id} className="input" type={type} placeholder={placeholder} {...register(name)} />
      {hint && !error && <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 3, display: 'block' }}>{hint}</span>}
      {error && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{error}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      {/* Left */}
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
            Start tracking.<br />Start improving.
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.65 }}>
            Join thousands of developers who use DevPulse to take their interview prep from guesswork to strategy.
          </p>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>© 2025 DevPulse</p>
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="page-enter">
          <h1 style={{ fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 6, color: 'var(--text)' }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginBottom: 32 }}>
            Already have one?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <F id="reg-name"     label="Full name"   placeholder="Jane Smith"  name="name"     error={errors.name?.message} />
              <F id="reg-username" label="Username"    placeholder="janesmith"   name="username" error={errors.username?.message} hint="Letters, numbers, _" />
            </div>
            <F id="reg-email"    label="Email"       type="email"     placeholder="you@example.com" name="email"    error={errors.email?.message} />
            <F id="reg-password" label="Password"    type="password"  placeholder="Min 6 characters" name="password" error={errors.password?.message} />
            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', padding: '11px', marginTop: 4 }}>
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
