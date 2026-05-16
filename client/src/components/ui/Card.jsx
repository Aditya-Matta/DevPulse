export default function Card({ children, className = '', style = {}, onClick }) {
  return (
    <div className={`card ${className}`} style={{ padding: 24, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}
