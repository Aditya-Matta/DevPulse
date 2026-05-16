import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useInterviewStore from '../store/interviewStore.js';
import InterviewCard from '../components/interview/InterviewCard.jsx';
import InterviewForm from '../components/interview/InterviewForm.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import api from '../lib/axios.js';
import useUIStore from '../store/uiStore.js';
import { ROUNDS, OUTCOMES } from '../lib/constants.js';

const selStyle = {
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderRadius: 'var(--r-md)', padding: '8px 12px',
  color: 'var(--text)', fontSize: '0.83rem', fontFamily: 'inherit',
  cursor: 'pointer', outline: 'none', transition: 'border-color 0.18s',
};

export default function InterviewLog() {
  const { interviews, loading, filters, setFilters, clearFilters, fetchInterviews, pages, currentPage, updateInterview } = useInterviewStore();
  const { addNotification } = useUIStore();
  const [editInterview, setEditInterview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => { fetchInterviews(1); }, [filters]);

  const handleEdit = async (data) => {
    setEditLoading(true);
    try {
      const res = await api.put(`/api/interviews/${editInterview._id}`, data);
      updateInterview(editInterview._id, res.data.data.interview);
      addNotification({ type: 'success', message: 'Interview updated' });
      setEditInterview(null);
    } catch {
      addNotification({ type: 'error', message: 'Update failed' });
    } finally { setEditLoading(false); }
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="label" style={{ marginBottom: 6 }}>Log</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '2rem', letterSpacing: '-0.025em', color: 'var(--text)' }}>
            Interviews
          </h1>
        </div>
        <Link to="/interviews/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          + Log interview
        </Link>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', padding: '14px 18px',
        display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      }}>
        <input
          className="input"
          style={{ flex: '1 1 200px', padding: '8px 12px', fontSize: '0.83rem' }}
          placeholder="Search company, role, notes…"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
        <select style={selStyle} value={filters.outcome} onChange={(e) => setFilters({ outcome: e.target.value })}>
          <option value="">All outcomes</option>
          {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select style={selStyle} value={filters.round} onChange={(e) => setFilters({ round: e.target.value })}>
          <option value="">All rounds</option>
          {ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input type="date" style={selStyle} value={filters.startDate} onChange={(e) => setFilters({ startDate: e.target.value })} />
        <input type="date" style={selStyle} value={filters.endDate} onChange={(e) => setFilters({ endDate: e.target.value })} />
        {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
      ) : interviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', marginBottom: 8 }}>
            {hasFilters ? 'No interviews match your filters' : 'No interviews yet'}
          </p>
          {!hasFilters && <Link to="/interviews/new" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.83rem' }}>Log your first →</Link>}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 14 }}>
            {interviews.map(iv => <InterviewCard key={iv._id} interview={iv} onEdit={setEditInterview} />)}
          </div>

          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => fetchInterviews(p)}
                  style={{
                    width: 34, height: 34, borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)', cursor: 'pointer',
                    background: p === currentPage ? 'var(--text)' : 'var(--bg-surface)',
                    color: p === currentPage ? 'var(--bg)' : 'var(--text-2)',
                    fontWeight: 500, fontSize: '0.83rem', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >{p}</button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={!!editInterview} onClose={() => setEditInterview(null)} title="Edit interview">
        {editInterview && (
          <InterviewForm
            defaultValues={{ ...editInterview, date: editInterview.date?.split('T')[0] }}
            onSubmit={handleEdit}
            loading={editLoading}
          />
        )}
      </Modal>
    </div>
  );
}
