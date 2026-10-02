import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PRIORITIES, STATUSES } from "../constants";
import { useProjects } from "../hooks/useProjects";
import { StatusBadge } from "../components/Badges";
import { dueInfo, formatDate, todayISO } from "../utils/date";

function StatCard({ label, value, tone = "" }) {
  return (
    <div className={`card stat ${tone}`}>
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BarList({ title, items, total }) {
  return (
    <div className="card panel">
      <h3>{title}</h3>
      {items.map((i) => (
        <div className="bar-row" key={i.label}>
          <span>{i.label}</span>
          <div className="bar">
            <span
              style={{ width: total ? `${(i.value / total) * 100}%` : "0%" }}
            />
          </div>
          <strong>{i.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { projects, loading, error, reload } = useProjects();

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status !== "Completed");
    const count = (key, value) =>
      projects.filter((p) => p[key] === value).length;

    return {
      total: projects.length,
      inProgress: count("status", "In Progress"),
      completed: count("status", "Completed"),
      overdue: active.filter((p) => p.due_date < todayISO()).length,
      byStatus: STATUSES.map((s) => ({ label: s, value: count("status", s) })),
      byPriority: PRIORITIES.map((p) => ({
        label: p,
        value: count("priority", p),
      })),
      upcoming: [...active]
        .sort((a, b) => a.due_date.localeCompare(b.due_date))
        .slice(0, 5),
    };
  }, [projects]);

  if (loading) return <div className="state">Loading dashboard...</div>;

  if (error) {
    return (
      <div className="state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Overview of all client projects</p>
        </div>
        <Link className="btn btn-primary" to="/projects/new">
          + New Project
        </Link>
      </div>

      <div className="stats">
        <StatCard label="Total projects" value={stats.total} />
        <StatCard label="In progress" value={stats.inProgress} tone="info" />
        <StatCard label="Completed" value={stats.completed} tone="success" />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          tone={stats.overdue ? "danger" : ""}
        />
      </div>

      <div className="panels">
        <BarList title="By status" items={stats.byStatus} total={stats.total} />
        <BarList
          title="By priority"
          items={stats.byPriority}
          total={stats.total}
        />
      </div>

      <div className="card panel">
        <h3>Upcoming deadlines</h3>
        {stats.upcoming.length === 0 ? (
          <p className="muted">No active projects.</p>
        ) : (
          <ul className="deadline-list">
            {stats.upcoming.map((p) => {
              const due = dueInfo(p);
              return (
                <li key={p.public_id}>
                  <div>
                    <Link to={`/projects/${p.public_id}/edit`}>
                      <strong>{p.project_name}</strong>
                    </Link>
                    <div className="muted">{p.client_name}</div>
                  </div>
                  <div className="right">
                    <StatusBadge value={p.status} />
                    <div className="muted">
                      {formatDate(p.due_date)}
                      {due && (
                        <span className={`due ${due.tone}`}>{due.label}</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
