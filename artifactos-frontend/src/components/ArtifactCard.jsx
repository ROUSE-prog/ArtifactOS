import { useNavigate } from "react-router-dom";

const artifactIcons = {
  diagram: "⌘",
  markdown: "M",
  image: "◈",
  document: "▤",
  code: "</>",
};

function formatDate(dateValue) {
  if (!dateValue) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}

export default function ArtifactCard({ artifact }) {
  const navigate = useNavigate();
  const icon = artifactIcons[artifact.artifact_type] || "◇";

  return (
    <article
      className="artifact-card glass"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/artifacts/${artifact.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(`/artifacts/${artifact.id}`);
        }
      }}
    >
      <div className="artifact-card-top">
        <div className={`artifact-icon ${artifact.artifact_type}`}>
          {icon}
        </div>

        <span className="artifact-type">
          {artifact.artifact_type}
        </span>
      </div>

      <div className="artifact-card-content">
        <h3>{artifact.title}</h3>
        <p>{artifact.description || "No description has been added."}</p>
      </div>

      <div className="tag-list">
        {artifact.tags?.map((tag) => (
          <span key={tag.id} className="tag-pill">
            {tag.name}
          </span>
        ))}
      </div>

      <footer className="artifact-card-footer">
        <span>{artifact.filename || "Stored artifact"}</span>
        <time>{formatDate(artifact.updated_at)}</time>
      </footer>
    </article>
  );
}
