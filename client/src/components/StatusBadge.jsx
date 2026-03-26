import { formatLabel } from '../utils/formatters.js';

const normalizeStatus = (status) =>
  String(status || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-${normalizeStatus(status)}`}>{formatLabel(status)}</span>;
}
