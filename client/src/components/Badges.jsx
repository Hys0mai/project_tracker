const slug = (v) => v.toLowerCase().replace(/\s+/g, "-");

export const StatusBadge = ({ value }) => (
  <span className={`badge status-${slug(value)}`}>{value}</span>
);

export const PriorityBadge = ({ value }) => (
  <span className={`badge priority-${slug(value)}`}>{value}</span>
);
