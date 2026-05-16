import Spinner from './Spinner.jsx';

export default function Button({
  children, variant = 'primary', size = 'md',
  className = '', disabled, loading, onClick, type = 'button', style, ...props
}) {
  const variantCls = {
    primary:   'btn btn-primary',
    secondary: 'btn btn-secondary',
    ghost:     'btn btn-ghost',
    danger:    'btn btn-danger',
    accent:    'btn btn-accent',
  }[variant] || 'btn btn-primary';

  const sizeCls = { sm: 'btn-sm', md: '', lg: 'btn-lg' }[size] || '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variantCls} ${sizeCls} ${className}`}
      style={style}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}
