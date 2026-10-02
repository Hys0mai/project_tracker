export default function ProjectList({ projects, onEdit, onDelete }) {
  if (projects.length === 0) return <p>No projects found.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Project</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Start</th>
          <th>Due</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.public_id}>
            <td>{p.client_name}</td>
            <td>
              <strong>{p.project_name}</strong>
              <div className="muted">{p.description}</div>
            </td>
            <td>
              <span className="badge">{p.status}</span>
            </td>
            <td>
              <span className={`badge p-${p.priority}`}>{p.priority}</span>
            </td>
            <td>{p.start_date}</td>
            <td>{p.due_date}</td>
            <td>
              <button onClick={() => onEdit(p)}>Edit</button>{" "}
              <button className="danger" onClick={() => onDelete(p.public_id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
