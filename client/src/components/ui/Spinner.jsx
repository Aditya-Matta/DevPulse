export default function Spinner({ size = 20, color = 'currentColor' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 20 20" fill="none"
      style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="2" strokeOpacity="0.2" />
      <path d="M10 2.5a7.5 7.5 0 0 1 7.5 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
