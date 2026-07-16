import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import ArtifactDetailPage from "./pages/ArtifactDetailPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import SignupPage from "./pages/SignupPage";

function protectedPage(page) {
  return <ProtectedRoute>{page}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/dashboard"
          element={protectedPage(<DashboardPage />)}
        />
        <Route
          path="/projects"
          element={protectedPage(<ProjectsPage />)}
        />
        <Route
          path="/projects/:projectId"
          element={protectedPage(<ProjectDetailPage />)}
        />
        <Route
          path="/artifacts/:artifactId"
          element={protectedPage(<ArtifactDetailPage />)}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
