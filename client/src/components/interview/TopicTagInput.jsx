import { useState, useRef } from 'react';

export default function TopicTagInput({ value = [], onChange }) {
  const [input, setInput] = useState('');
  const ref = useRef(null);

  const add = (tag) => {
    const clean = tag.trim().toLowerCase();
    if (clean && !value.includes(clean)) onChange([...value, clean]);
    setInput('');
  };

  const remove = (tag) => onChange(value.filter((t) => t !== tag));

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }
    else if (e.key === 'Backspace' && !input && value.length) remove(value[value.length - 1]);
  };

  return (
    <div
      onClick={() => ref.current?.focus()}
      style={{
        display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)', padding: '7px 10px', minHeight: 42, cursor: 'text',
        transition: 'border-color 0.18s, box-shadow 0.18s',
      }}
      onFocusCapture={e => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-muted)';
      }}
      onBlurCapture={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {value.map((tag) => (
        <span key={tag} className="tag" style={{ paddingRight: 5 }}>
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); remove(tag); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-3)', fontSize: '0.85rem', lineHeight: 1, padding: 0,
              marginLeft: 2, display: 'inline-flex', alignItems: 'center',
            }}
          >×</button>
        </span>
      ))}
      <input
        ref={ref}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => { if (input.trim()) add(input); }}
        placeholder={value.length === 0 ? 'Add topics (press Enter)…' : ''}
        style={{
          border: 'none', outline: 'none', background: 'transparent',
          color: 'var(--text)', fontSize: '0.85rem', flex: 1, minWidth: 120,
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
