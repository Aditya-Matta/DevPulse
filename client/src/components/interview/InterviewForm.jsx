import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button.jsx';
import TopicTagInput from './TopicTagInput.jsx';
import { ROUNDS, OUTCOMES } from '../../lib/constants.js';

const schema = z.object({
  company:    z.string().min(1, 'Company is required'),
  role:       z.string().min(1, 'Role is required'),
  round:      z.enum(['OA','Phone','Technical','HR','Final']),
  outcome:    z.enum(['Passed','Failed','Pending']),
  difficulty: z.number().min(1).max(5),
  date:       z.string().min(1, 'Date is required'),
  topics:     z.array(z.string()).default([]),
  notes:      z.string().optional(),
});

const Field = ({ label, error, children, hint }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.01em' }}>{label}</label>
    {children}
    {hint && !error && <span style={{ fontSize: '0.73rem', color: 'var(--text-3)' }}>{hint}</span>}
    {error && <span style={{ fontSize: '0.73rem', color: 'var(--danger)' }}>{error}</span>}
  </div>
);

const StarPicker = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 3 }}>
    {[1,2,3,4,5].map((s) => (
      <button
        key={s} type="button" onClick={() => onChange(s)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '1.3rem', padding: '2px 3px',
          color: s <= value ? 'var(--warning)' : 'var(--border-strong)',
          transition: 'color 0.12s, transform 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >★</button>
    ))}
  </div>
);

const selectStyle = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-md)',
  padding: '10px 14px',
  color: 'var(--text)',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  cursor: 'pointer',
  outline: 'none',
  transition: 'border-color 0.18s',
};

export default function InterviewForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      company: '', role: '', round: 'Technical', outcome: 'Pending', difficulty: 3,
      date: new Date().toISOString().split('T')[0], topics: [], notes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Company" error={errors.company?.message}>
          <input className="input" placeholder="e.g. Google" {...register('company')} />
        </Field>
        <Field label="Role" error={errors.role?.message}>
          <input className="input" placeholder="e.g. Software Engineer" {...register('role')} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Field label="Round" error={errors.round?.message}>
          <select className="input" style={selectStyle} {...register('round')}>
            {ROUNDS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Outcome" error={errors.outcome?.message}>
          <select className="input" style={selectStyle} {...register('outcome')}>
            {OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Date" error={errors.date?.message}>
          <input type="date" className="input" {...register('date')} />
        </Field>
      </div>

      <Field label="Difficulty" error={errors.difficulty?.message}>
        <Controller name="difficulty" control={control} render={({ field }) => (
          <StarPicker value={field.value} onChange={field.onChange} />
        )} />
      </Field>

      <Field label="Topics" hint="Press Enter or comma to add a topic">
        <Controller name="topics" control={control} render={({ field }) => (
          <TopicTagInput value={field.value} onChange={field.onChange} />
        )} />
      </Field>

      <Field label="Notes" error={errors.notes?.message}>
        <textarea className="input" rows={4} placeholder="How did it go? Key takeaways, feedback…" style={{ resize: 'vertical' }} {...register('notes')} />
      </Field>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
        <Button type="submit" variant="primary" loading={loading} style={{ minWidth: 140 }}>
          {defaultValues ? 'Save changes' : 'Log interview'}
        </Button>
      </div>
    </form>
  );
}
