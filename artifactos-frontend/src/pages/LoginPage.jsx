import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("demo@artifactos.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card glass">
        <div className="brand-mark">A</div>

        <p className="eyebrow">ENGINEERING KNOWLEDGE</p>
        <h1>ArtifactOS</h1>
        <p className="subtitle">
          Preserve, organize, and rediscover the work behind every system.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Enter workspace"}
          </button>
        </form>
      </section>
    </main>
  );
}