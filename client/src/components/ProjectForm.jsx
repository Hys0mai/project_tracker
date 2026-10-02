import { useEffect, useState } from "react";
import { STATUSES, PRIORITIES } from "../constants";

const toFormValues = (p = {}) => {
  const project = p ?? {};
  return {
    client_name: project.client_name ?? "",
    project_name: project.project_name ?? "",
    description: project.description ?? "",
    status: project.status ?? "Planning",
    priority: project.priority ?? "Medium",
    start_date: project.start_date ?? "",
    due_date: project.due_date ?? "",
  };
};

function validate(f) {
  const e = {};
  if (!f.client_name.trim()) e.client_name = "Client name is required.";
  if (!f.project_name.trim()) e.project_name = "Project name is required.";
  if (!STATUSES.includes(f.status)) e.status = "Invalid status.";
  if (!PRIORITIES.includes(f.priority)) e.priority = "Invalid priority.";
  if (!f.start_date) e.start_date = "Start date is required.";
  if (!f.due_date) e.due_date = "Due date is required.";
  else if (f.start_date && f.due_date < f.start_date)
    e.due_date = "Due date cannot be earlier than start date.";
  return e;
}

function Field({ label, name, error, required, full, children }) {
  return (
    <div className={`field ${full ? "full" : ""} ${error ? "has-error" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
      {error && (
        <small className="error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

export default function ProjectForm({
  initialValues,
  isEdit,
  submitting,
  serverErrors,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(() => toFormValues(initialValues));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors(serverErrors ?? {});
  }, [serverErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      ...form,
      client_name: form.client_name.trim(),
      project_name: form.project_name.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <Field
          label="Client Name"
          name="client_name"
          error={errors.client_name}
          required
        >
          <input
            id="client_name"
            name="client_name"
            value={form.client_name}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
          />
        </Field>

        <Field
          label="Project Name"
          name="project_name"
          error={errors.project_name}
          required
        >
          <input
            id="project_name"
            name="project_name"
            value={form.project_name}
            onChange={handleChange}
            placeholder="e.g. Website Redesign"
          />
        </Field>

        <Field
          label="Description"
          name="description"
          error={errors.description}
          full
        >
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="What is this project about?"
          />
        </Field>

        <Field label="Status" name="status" error={errors.status} required>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field
          label="Priority"
          name="priority"
          error={errors.priority}
          required
        >
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>

        <Field
          label="Start Date"
          name="start_date"
          error={errors.start_date}
          required
        >
          <input
            id="start_date"
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
          />
        </Field>

        <Field
          label="Due Date"
          name="due_date"
          error={errors.due_date}
          required
        >
          <input
            id="due_date"
            type="date"
            name="due_date"
            value={form.due_date}
            min={form.start_date || undefined}
            onChange={handleChange}
          />
        </Field>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create Project"}
        </button>
      </div>
    </form>
  );
}
