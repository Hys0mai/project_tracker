import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProject } from "../api";
import { PRIORITY_WEIGHT, STATUS_ORDER } from "../constants";
import { useDebounce } from "../hooks/useDebounce";
import { useProjects } from "../hooks/useProjects";
import ConfirmDialog from "../components/ConfirmDialog";
import ProjectFilters from "../components/ProjectFilters";
import ProjectTable from "../components/ProjectTable";
import { useToast } from "../components/Toast";

const INITIAL_FILTERS = { search: "", status: "", priority: "" };

function sortValue(project, key) {
  if (key === "priority") return PRIORITY_WEIGHT[project.priority];
  if (key === "status") return STATUS_ORDER[project.status];
  return (project[key] ?? "").toString().toLowerCase();
}

export default function ProjectsPage() {
  const { projects, setProjects, loading, error, reload } = useProjects();
  const notify = useToast();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState({ key: "due_date", dir: "asc" });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 300);

  const visible = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const dir = sort.dir === "asc" ? 1 : -1;

    return projects
      .filter((p) => {
        if (filters.status && p.status !== filters.status) return false;
        if (filters.priority && p.priority !== filters.priority) return false;
        if (q) {
          const haystack =
            `${p.client_name} ${p.project_name} ${p.description ?? ""}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const av = sortValue(a, sort.key);
        const bv = sortValue(b, sort.key);
        return av < bv ? -dir : av > bv ? dir : 0;
      });
  }, [projects, debouncedSearch, filters.status, filters.priority, sort]);

  const handleFilterChange = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const handleSort = (key) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(toDelete.public_id);
      setProjects((list) => list.filter((p) => p.public_id !== toDelete.public_id));
      notify("Project deleted.");
      setToDelete(null);
    } catch {
      notify("Failed to delete project.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          {!loading && !error && (
            <p className="muted">
              Showing {visible.length} of {projects.length} projects
            </p>
          )}
        </div>
        <Link className="btn btn-primary" to="/projects/new">
          + New Project
        </Link>
      </div>

      <ProjectFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />

      {loading && <div className="state">Loading projects...</div>}

      {error && (
        <div className="state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={reload}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="state">
          <h3>No projects yet</h3>
          <p className="muted">Create your first project to get started.</p>
          <Link className="btn btn-primary" to="/projects/new">
            + New Project
          </Link>
        </div>
      )}

      {!loading && !error && projects.length > 0 && visible.length === 0 && (
        <div className="state">
          <h3>No matching projects</h3>
          <p className="muted">Try a different search or clear the filters.</p>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <ProjectTable
          projects={visible}
          sort={sort}
          onSort={handleSort}
          onDelete={setToDelete}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete project?"
          message={`"${toDelete.project_name}" for ${toDelete.client_name} will be permanently deleted.`}
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => !deleting && setToDelete(null)}
        />
      )}
    </>
  );
}
