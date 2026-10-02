import { STATUSES, PRIORITIES } from "../constants";

export default function ProjectFilters({ filters, onChange, onReset }) {
  const hasActive = filters.search || filters.status || filters.priority;

  return (
    <div className="filters">
      <input
        className="search"
        type="search"
        placeholder="Search client, project or description..."
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
      />

      <select
        value={filters.status}
        onChange={(e) => onChange("status", e.target.value)}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => onChange("priority", e.target.value)}
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      {hasActive && (
        <button className="btn btn-ghost" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}
