import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardPage() {
  const [artifacts, setArtifacts] = useState([]);

  useEffect(() => {
    async function loadArtifacts() {
      const token = localStorage.getItem("token");

      const response = await api.get("/artifacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setArtifacts(response.data.artifacts);
    }

    loadArtifacts();
  }, []);

  return (
    <div>
      <h1>ArtifactOS Dashboard</h1>

      {artifacts.map((artifact) => (
        <div key={artifact.id}>
          <h3>{artifact.title}</h3>
          <p>{artifact.description}</p>
        </div>
      ))}
    </div>
  );
}