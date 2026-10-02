import { Link } from "react-router-dom";
import { PriorityBadge, StatusBadge } from "./Badges";
import { dueInfo, formatDate } from "../utils/date";

const COLUMNS = [
  { key: "client_name", label: "Client" },
  { key: "project_name", label: "Project" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "start_date", label: "Start" },
  { key: "due_date", label: "Due" },
];

export default function ProjectTable({ projects, sort, onSort, onDelete }) {
  const ariaSort = (key) =>
    sort.key !== key ? "none" : sort.dir === "asc" ? "ascending" : "descending";
  const arrow = (key) =>
    sort.key === key ? (sort.dir === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th key={c.key} aria-sort={ariaSort(c.key)}>
                <button className="th-btn" onClick={() => onSort(c.key)}>
                  {c.label}
                  {arrow(c.key)}
                </button>
              </th>
            ))}
            <th className="right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const due = dueInfo(p);
            return (
              <tr key={p.public_id}>
                <td>{p.client_name}</td>
                <td>
                  <strong>{p.project_name}</strong>
                  {p.description && (
                    <div className="muted clamp">{p.description}</div>
                  )}
                </td>
                <td>
                  <StatusBadge value={p.status} />
                </td>
                <td>
                  <PriorityBadge value={p.priority} />
                </td>
                <td>{formatDate(p.start_date)}</td>
                <td>
                  {formatDate(p.due_date)}
                  {due && (
                    <span className={`due ${due.tone}`}>{due.label}</span>
                  )}
                </td>
                <td className="right nowrap">
                  <Link
                    className="btn btn-ghost btn-sm"
                    to={`/projects/${p.public_id}/edit`}
                  >
                    Edit
                  </Link>{" "}
                  <button
                    className="btn btn-danger-ghost btn-sm"
                    onClick={() => onDelete(p)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
