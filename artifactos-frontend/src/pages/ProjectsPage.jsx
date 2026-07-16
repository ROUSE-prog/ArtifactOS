import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

import "./ProjectsPage.css";

const emptyForm = {
  title: "",
  description: "",
};

export default function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function authHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
  }

  async function loadProjects() {
    try {
      const response = await api.get("/projects", {
        headers: authHeaders(),
      });

      setProjects(response.data.projects);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError("ArtifactOS could not load your projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }

    loadProjects();
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function beginEdit(project) {
    setEditingId(project.id);

    setForm({
      title: project.title,
      description: project.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Project title is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        const response = await api.patch(
          `/projects/${editingId}`,
          {
            title,
            description: form.description.trim(),
          },
          {
            headers: authHeaders(),
          },
        );

        setProjects((currentProjects) =>
          currentProjects.map((project) =>
            project.id === editingId
              ? response.data.project
              : project,
          ),
        );
      } else {
        const response = await api.post(
          "/projects",
          {
            title,
            description: form.description.trim(),
          },
          {
            headers: authHeaders(),
          },
        );

        setProjects((currentProjects) => [
          response.data.project,
          ...currentProjects,
        ]);
      }

      cancelEdit();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "The project could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project) {
    const confirmed = window.confirm(
      `Delete “${project.title}” and all of its artifacts?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projects/${project.id}`, {
        headers: authHeaders(),
      });

      setProjects((currentProjects) =>
        currentProjects.filter(
          (currentProject) => currentProject.id !== project.id,
        ),
      );

      if (editingId === project.id) {
        cancelEdit();
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "The project could not be deleted.",
      );
    }
  }

  return (
    <div className="projects-page">
      <Sidebar />

      <main className="projects-main">
        <header className="projects-header glass">
          <div>
            <p className="dashboard-eyebrow">PROJECT LIBRARY</p>
            <h1>Organize the systems behind your work.</h1>
            <p>
              Projects keep related diagrams, schemas, notes, and
              technical decisions together.
            </p>
          </div>

          <div className="project-count">
            <strong>{projects.length}</strong>
            <span>Projects</span>
          </div>
        </header>

        <section className="project-form-panel glass">
          <div className="project-form-heading">
            <div>
              <p className="dashboard-eyebrow">
                {editingId ? "EDIT PROJECT" : "NEW PROJECT"}
              </p>

              <h2>
                {editingId
                  ? "Update project"
                  : "Create a workspace"}
              </h2>
            </div>

            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>

          <form className="project-form" onSubmit={handleSubmit}>
            <label>
              Project title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: ArtifactOS"
                maxLength={150}
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What engineering work belongs here?"
                rows={4}
              />
            </label>

            {error && (
              <p className="project-error">{error}</p>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create project"}
            </button>
          </form>
        </section>

        <section className="projects-content">
          <div className="project-section-heading">
            <div>
              <p className="dashboard-eyebrow">YOUR WORKSPACES</p>
              <h2>Projects</h2>
            </div>
          </div>

          {loading && (
            <div className="projects-message glass">
              Loading projects...
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="projects-message glass">
              Create your first project to begin organizing
              engineering artifacts.
            </div>
          )}

          <div className="project-grid">
            {projects.map((project) => (
              <article
                className="project-card glass"
                key={project.id}
              >
                <button
                  className="project-open-button"
                  type="button"
                  onClick={() =>
                    navigate(`/projects/${project.id}`)
                  }
                >
                  <div className="project-card-icon">P</div>

                  <div className="project-card-copy">
                    <h3>{project.title}</h3>

                    <p>
                      {project.description ||
                        "No description has been added."}
                    </p>
                  </div>
                </button>

                <footer className="project-card-footer">
                  <span>
                    Updated{" "}
                    {new Date(
                      project.updated_at,
                    ).toLocaleDateString()}
                  </span>

                  <div className="project-card-actions">
                    <button
                      type="button"
                      onClick={() => beginEdit(project)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-project-button"
                      type="button"
                      onClick={() => handleDelete(project)}
                    >
                      Delete
                    </button>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}