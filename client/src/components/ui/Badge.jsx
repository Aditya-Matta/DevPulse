export default function Badge({ children, variant = 'round', className = '' }) {
  const cls = {
    passed:  'badge badge-passed',
    failed:  'badge badge-failed',
    pending: 'badge badge-pending',
    round:   'badge badge-round',
  }[variant] || 'badge badge-round';
  return <span className={`${cls} ${className}`}>{children}</span>;
}
