import { useNavigate } from 'react-router-dom';
import InterviewForm from '../components/interview/InterviewForm.jsx';
import { useState } from 'react';
import api from '../lib/axios.js';
import useInterviewStore from '../store/interviewStore.js';
import useUIStore from '../store/uiStore.js';

export default function NewInterview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { addInterview } = useInterviewStore();
  const { addNotification } = useUIStore();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/api/interviews', data);
      addInterview(res.data.data.interview);
      addNotification({ type: 'success', message: 'Interview logged' });
      navigate('/interviews');
    } catch (err) {
      addNotification({ type: 'error', message: err.response?.data?.message || 'Failed' });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', fontSize: '0.82rem', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 5, padding: 0, marginBottom: 16,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >← Back</button>
        <p className="label" style={{ marginBottom: 6 }}>New entry</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '2rem', letterSpacing: '-0.025em', color: 'var(--text)' }}>
          Log an interview
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginTop: 8 }}>
          Record the details of your interview to track your progress over time.
        </p>
      </div>

      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)', padding: '32px 36px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <InterviewForm onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  );
}
