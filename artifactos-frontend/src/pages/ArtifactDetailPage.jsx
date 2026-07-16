import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

import "./ArtifactDetailPage.css";

export default function ArtifactDetailPage() {
  const { artifactId } = useParams();
  const navigate = useNavigate();

  const [artifact, setArtifact] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArtifact() {
      try {
        const response = await api.get(`/artifacts/${artifactId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setArtifact(response.data.artifact);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError("ArtifactOS could not load this artifact.");
      }
    }

    loadArtifact();
  }, [artifactId, navigate]);

  return (
    <div className="artifact-detail-page">
      <Sidebar />

      <main className="artifact-detail-main">
        {error && <div className="dashboard-message error glass">{error}</div>}

        {!error && !artifact && (
          <div className="dashboard-message glass">Loading artifact...</div>
        )}

        {artifact && (
          <article className="artifact-detail-card glass">
            <button
              className="back-button"
              type="button"
              onClick={() => navigate(`/projects/${artifact.project_id}`)}
            >
              ← Project
            </button>

            <p className="dashboard-eyebrow">
              {artifact.artifact_type}
            </p>

            <h1>{artifact.title}</h1>
            <p className="artifact-detail-description">
              {artifact.description || "No description has been added."}
            </p>

            <dl className="artifact-metadata">
              <div>
                <dt>Filename</dt>
                <dd>{artifact.filename || "Not provided"}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>
                  {new Date(artifact.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>

            {artifact.tags?.length > 0 && (
              <div className="tag-list">
                {artifact.tags.map((tag) => (
                  <span className="tag-pill" key={tag.id}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {artifact.text_content && (
              <pre className="artifact-text-content">
                {artifact.text_content}
              </pre>
            )}
          </article>
        )}
      </main>
    </div>
  );
}
