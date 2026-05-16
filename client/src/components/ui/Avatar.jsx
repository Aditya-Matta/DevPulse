export default function Avatar({ name = '', avatarUrl = '', size = 36, className = '' }) {
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  // Warm muted palette for initials avatars
  const palette = ['#5a7a4a','#7a6a52','#a05c50','#4a6a7a','#8a6a3a','#5a4a7a'];
  const bg = palette[name.charCodeAt(0) % palette.length];

  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} className={className} />
    );
  }

  return (
    <div className={className} style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fff', fontWeight: 600,
      fontSize: size * 0.36, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, userSelect: 'none',
      letterSpacing: '-0.01em',
    }}>
      {initials}
    </div>
  );
}
