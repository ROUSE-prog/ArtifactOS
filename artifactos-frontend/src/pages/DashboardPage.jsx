import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArtifactCard from "../components/ArtifactCard";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

import "./DashboardPage.css";

const PER_PAGE = 6;

export default function DashboardPage() {
  const navigate = useNavigate();

  const [artifacts, setArtifacts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArtifacts() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get("/artifacts", {
          params: {
            page,
            per_page: PER_PAGE,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseArtifacts = response.data.artifacts || [];
        const responsePagination = response.data.pagination;

        setArtifacts(responseArtifacts);
        setPagination(
          responsePagination || {
            page: 1,
            pages: 1,
            total: responseArtifacts.length,
          },
        );
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
  }, [navigate, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

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
        artifact.text_content,
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
          artifactCount={pagination.total}
        />

        <section className="dashboard-content">
          <div className="section-heading">
            <div>
              <p className="dashboard-eyebrow">RECENT ACTIVITY</p>
              <h2>Recent artifacts</h2>
            </div>

            <button
              className="view-button"
              type="button"
              onClick={() => navigate("/projects")}
            >
              View projects
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
              {search
                ? "No artifacts on this page match your search."
                : "No artifacts have been created yet."}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="artifact-grid">
                {filteredArtifacts.map((artifact) => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                  />
                ))}
              </div>

              {!search && (
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  total={pagination.total}
                  itemLabel="artifacts"
                  onPrevious={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  onNext={() =>
                    setPage((current) =>
                      Math.min(pagination.pages, current + 1),
                    )
                  }
                />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
