import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArtifactCard from "../components/ArtifactCard";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [artifacts, setArtifacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArtifacts() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await api.get("/artifacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setArtifacts(response.data.artifacts);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError("ArtifactOS could not load your workspace.");
      } finally {
        setLoading(false);
      }
    }

    loadArtifacts();
  }, [navigate]);

  const filteredArtifacts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return artifacts;
    }

    return artifacts.filter((artifact) => {
      const searchableText = [
        artifact.title,
        artifact.description,
        artifact.artifact_type,
        artifact.filename,
        ...(artifact.tags || []).map((tag) => tag.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [artifacts, search]);

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        <Header
          search={search}
          onSearchChange={setSearch}
          artifactCount={artifacts.length}
        />

        <section className="dashboard-content">
          <div className="section-heading">
            <div>
              <p className="dashboard-eyebrow">RECENT ACTIVITY</p>
              <h2>Recent artifacts</h2>
            </div>

            <button className="view-button" type="button">
              View all
            </button>
          </div>

          {loading && (
            <div className="dashboard-message glass">
              Loading your engineering knowledge...
            </div>
          )}

          {error && (
            <div className="dashboard-message error glass">
              {error}
            </div>
          )}

          {!loading && !error && filteredArtifacts.length === 0 && (
            <div className="dashboard-message glass">
              No artifacts match your search.
            </div>
          )}

          <div className="artifact-grid">
            {filteredArtifacts.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}