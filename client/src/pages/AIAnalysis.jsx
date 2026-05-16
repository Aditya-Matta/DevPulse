import { useEffect, useState } from 'react';
import useAIAnalysis from '../hooks/useAIAnalysis.js';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const WeaknessCard = ({ weakness, index }) => {
  const [checked, setChecked] = useState([]);
  const toggle = (i) => setChecked(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i]);

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)', padding: '28px 32px',
      boxShadow: 'var(--shadow-xs)',
      animation: `fade-up 0.4s ease ${index * 0.1}s both`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--r-md)',
          background: 'var(--bg-raised)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Serif Display', serif", fontWeight: 400,
          fontSize: '1.1rem', color: 'var(--text-2)', flexShrink: 0,
        }}>{index + 1}</div>
        <div>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '1.3rem', color: 'var(--text)', textTransform: 'capitalize', letterSpacing: '-0.015em', marginBottom: 2 }}>
            {weakness.topic}
          </h3>
          <span className="label">Weak area #{index + 1}</span>
        </div>
      </div>

      {/* Diagnosis */}
      <div style={{
        background: 'var(--bg-raised)', borderRadius: 'var(--r-md)',
        padding: '14px 18px', marginBottom: 20,
        borderLeft: '3px solid var(--accent)',
      }}>
        <p className="label" style={{ color: 'var(--accent)', marginBottom: 6 }}>Diagnosis</p>
        <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{weakness.diagnosis}</p>
      </div>

      {/* Study plan */}
      <div>
        <p className="label" style={{ marginBottom: 12 }}>Study plan</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weakness.studyPlan?.map((item, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox" checked={checked.includes(i)}
                onChange={() => toggle(i)}
                style={{ marginTop: 3, width: 14, height: 14, accentColor: 'var(--accent)', flexShrink: 0 }}
              />
              <span style={{
                fontSize: '0.86rem', lineHeight: 1.55, color: 'var(--text-2)',
                textDecoration: checked.includes(i) ? 'line-through' : 'none',
                opacity: checked.includes(i) ? 0.5 : 1,
                transition: 'all 0.2s',
              }}>{item}</span>
            </label>
          ))}
        </div>
        <p style={{ fontSize: '0.73rem', color: 'var(--text-3)', marginTop: 10 }}>
          {checked.length}/{weakness.studyPlan?.length || 0} completed
        </p>
      </div>
    </div>
  );
};

export default function AIAnalysis() {
  const { analysis, loading, error, callsRemaining, triggerAnalysis, fetchLastAnalysis } = useAIAnalysis();

  useEffect(() => { fetchLastAnalysis(); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'flex-end' }}>
        <div>
          <p className="label" style={{ marginBottom: 6 }}>AI coaching</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '2rem', letterSpacing: '-0.025em', color: 'var(--text)' }}>
            Weakness Analysis
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginTop: 8, lineHeight: 1.6 }}>
            GPT-4o-mini analyses your last 50 interviews and identifies your top 3 weak areas with a personalised study plan.
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            onClick={triggerAnalysis}
            loading={loading}
            disabled={callsRemaining === 0}
          >
            {loading ? 'Analysing…' : 'Run analysis'}
          </Button>
          {callsRemaining !== null && (
            <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', textAlign: 'right', marginTop: 5 }}>
              {callsRemaining}/3 daily uses remaining
            </p>
          )}
          {error && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 5, textAlign: 'right' }}>{error}</p>}
        </div>
      </div>

      <hr className="divider" />

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[0,1,2].map(i => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--r-lg)' }} />)}
        </div>
      )}

      {/* Results */}
      {!loading && analysis?.weaknesses?.length > 0 && (
        <>
          {analysis.generatedAt && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              Generated {new Date(analysis.generatedAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {analysis.weaknesses.map((w, i) => <WeaknessCard key={w.topic} weakness={w} index={i} />)}
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && !analysis?.weaknesses?.length && (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-3)' }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: 'var(--text-2)', marginBottom: 8 }}>No analysis yet</p>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>Log at least 3 interviews, then click <em>Run analysis</em> to get your personalised weakness report.</p>
        </div>
      )}
    </div>
  );
}
