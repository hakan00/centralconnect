export default function MetricCard({ label, value, hint, accent = 'default' }) {
  return (
    <article className={`metric-card metric-card-${accent} reveal`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {hint ? <p className="metric-hint">{hint}</p> : null}
    </article>
  );
}
