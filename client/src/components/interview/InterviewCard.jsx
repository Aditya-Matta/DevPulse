import { useState } from 'react';
import Badge from '../ui/Badge.jsx';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import api from '../../lib/axios.js';
import useInterviewStore from '../../store/interviewStore.js';
import useUIStore from '../../store/uiStore.js';

export default function InterviewCard({ interview, onEdit }) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { removeInterview } = useInterviewStore();
  const { addNotification } = useUIStore();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/interviews/${interview._id}`);
      removeInterview(interview._id);
      addNotification({ type: 'success', message: 'Interview removed' });
      setDeleteModal(false);
    } catch {
      addNotification({ type: 'error', message: 'Failed to delete' });
    } finally { setDeleting(false); }
  };

  const dateStr = new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const outcomeVariant = { Passed: 'passed', Failed: 'failed', Pending: 'pending' }[interview.outcome] || 'round';

  return (
    <>
      <article style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '20px 22px',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
        boxShadow: 'var(--shadow-xs)',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.borderColor = 'var(--border-strong)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
              {interview.company}
            </div>
            <div style={{ color: 'var(--text-2)', fontSize: '0.82rem', marginTop: 2 }}>{interview.role}</div>
          </div>
          <div style={{ display: 'flex', gap: 5, flexShrink: 0, alignItems: 'center' }}>
            <Badge variant="round">{interview.round}</Badge>
            <Badge variant={outcomeVariant}>{interview.outcome}</Badge>
          </div>
        </div>

        {/* Stars + Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map((s) => (
              <span key={s} style={{ fontSize: '0.8rem', color: s <= interview.difficulty ? 'var(--warning)' : 'var(--border-strong)' }}>★</span>
            ))}
          </div>
          <span style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{dateStr}</span>
        </div>

        {/* Topics */}
        {interview.topics?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {interview.topics.slice(0, 5).map((t) => <span key={t} className="tag">{t}</span>)}
            {interview.topics.length > 5 && <span className="tag">+{interview.topics.length - 5}</span>}
          </div>
        )}

        {/* Notes preview */}
        {interview.notes && (
          <p style={{
            color: 'var(--text-2)', fontSize: '0.8rem', lineHeight: 1.55, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{interview.notes}</p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 7, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(interview)} style={{ flex: 1 }}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)} style={{ flex: 1 }}>Delete</Button>
        </div>
      </article>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete interview"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: '0.9rem' }}>
          Remove the <strong style={{ color: 'var(--text)' }}>{interview.company}</strong> — {interview.role} interview? This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
