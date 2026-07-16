import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArtifactCard from "../components/ArtifactCard";
import ArtifactForm from "../components/ArtifactForm";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

import "./ProjectDetailPage.css";

const emptyArtifact = {
  title: "",
  description: "",
  artifact_type: "diagram",
  filename: "",
  text_content: "",
};

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [artifacts, setArtifacts] = useState([]);
  const [form, setForm] = useState(emptyArtifact);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function headers() {
    return {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
  }

  useEffect(() => {
    async function loadProject() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await api.get(`/projects/${projectId}`, {
          headers: headers(),
        });

        setProject(response.data.project);
        setArtifacts(response.data.project.artifacts || []);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        if (requestError.response?.status === 404) {
          navigate("/projects");
          return;
        }

        setError("ArtifactOS could not load this project.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [navigate, projectId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function beginEdit(artifact) {
    setEditingId(artifact.id);
    setForm({
      title: artifact.title || "",
      description: artifact.description || "",
      artifact_type: artifact.artifact_type || "diagram",
      filename: artifact.filename || "",
      text_content: artifact.text_content || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyArtifact);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Artifact title is required.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title,
      description: form.description.trim() || null,
      artifact_type: form.artifact_type,
      filename: form.filename.trim() || null,
      text_content: form.text_content.trim() || null,
      project_id: Number(projectId),
    };

    try {
      if (editingId) {
        const response = await api.patch(
          `/artifacts/${editingId}`,
          payload,
          { headers: headers() },
        );

        setArtifacts((current) =>
          current.map((artifact) =>
            artifact.id === editingId
              ? response.data.artifact
              : artifact,
          ),
        );
      } else {
        const response = await api.post(
          "/artifacts",
          payload,
          { headers: headers() },
        );

        setArtifacts((current) => [
          response.data.artifact,
          ...current,
        ]);
      }

      cancelEdit();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "The artifact could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(artifact) {
    const confirmed = window.confirm(
      `Delete “${artifact.title}”?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/artifacts/${artifact.id}`, {
        headers: headers(),
      });

      setArtifacts((current) =>
        current.filter((item) => item.id !== artifact.id),
      );

      if (editingId === artifact.id) {
        cancelEdit();
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "The artifact could not be deleted.",
      );
    }
  }

  const filteredArtifacts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return artifacts;
    }

    return artifacts.filter((artifact) => {
      const text = [
        artifact.title,
        artifact.description,
        artifact.artifact_type,
        artifact.filename,
        artifact.text_content,
        ...(artifact.tags || []).map((tag) => tag.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(term);
    });
  }, [artifacts, search]);

  if (loading) {
    return (
      <div className="project-detail-page">
        <Sidebar />
        <main className="project-detail-main">
          <div className="project-detail-message glass">
            Loading project...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <Sidebar />

      <main className="project-detail-main">
        <header className="project-detail-header glass">
          <div>
            <button
              className="back-button"
              type="button"
              onClick={() => navigate("/projects")}
            >
              ← Projects
            </button>

            <p className="dashboard-eyebrow">PROJECT WORKSPACE</p>
            <h1>{project?.title}</h1>
            <p>
              {project?.description ||
                "No project description has been added."}
            </p>
          </div>

          <div className="project-detail-count">
            <strong>{artifacts.length}</strong>
            <span>Artifacts</span>
          </div>
        </header>

        <ArtifactForm
          form={form}
          editingId={editingId}
          saving={saving}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={cancelEdit}
        />

        <section className="project-artifacts-section">
          <div className="project-artifacts-heading">
            <div>
              <p className="dashboard-eyebrow">
                ENGINEERING ARTIFACTS
              </p>
              <h2>Project knowledge</h2>
            </div>

            <input
              className="project-artifact-search"
              type="search"
              placeholder="Search this project..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {filteredArtifacts.length === 0 ? (
            <div className="project-detail-message glass">
              No artifacts match this project search.
            </div>
          ) : (
            <div className="project-artifact-grid">
              {filteredArtifacts.map((artifact) => (
                <div
                  className="project-artifact-wrapper"
                  key={artifact.id}
                >
                  <ArtifactCard artifact={artifact} />

                  <div className="project-artifact-actions">
                    <button
                      type="button"
                      onClick={() => beginEdit(artifact)}
                    >
                      Edit
                    </button>

                    <button
                      className="artifact-delete-button"
                      type="button"
                      onClick={() => handleDelete(artifact)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
