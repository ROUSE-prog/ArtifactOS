import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("demo@artifactos.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>ArtifactOS</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button>Sign In</button>
      </form>

      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
}