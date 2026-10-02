import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProject, getProject, updateProject } from "../api";
import ProjectForm from "../components/ProjectForm";
import { useToast } from "../components/Toast";

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const notify = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    let ignore = false;

    getProject(id)
      .then(({ data }) => !ignore && setProject(data))
      .catch((err) => {
        if (ignore) return;
        notify(
          err.response?.status === 404
            ? "Project not found."
            : "Failed to load project.",
          "error",
        );
        navigate("/projects", { replace: true });
      })
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [id, isEdit, navigate, notify]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setServerErrors({});
    try {
      if (isEdit) await updateProject(id, values);
      else await createProject(values);
      notify(isEdit ? "Project updated." : "Project created.");
      navigate("/projects");
    } catch (err) {
      if (err.response?.status === 422) {
        const raw = err.response.data.errors ?? {};
        setServerErrors(
          Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v[0]])),
        );
        notify("Please fix the highlighted fields.", "error");
      } else {
        notify("Something went wrong. Please try again.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <Link to="/projects" className="back-link">
            ← Back to projects
          </Link>
          <h1>{isEdit ? "Edit Project" : "New Project"}</h1>
        </div>
      </div>

      {loading ? (
        <div className="state">Loading project...</div>
      ) : (
        <ProjectForm
          key={id ?? "new"}
          initialValues={project}
          isEdit={isEdit}
          submitting={submitting}
          serverErrors={serverErrors}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/projects")}
        />
      )}
    </>
  );
}
