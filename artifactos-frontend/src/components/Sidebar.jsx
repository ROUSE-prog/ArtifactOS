import { NavLink, useNavigate } from "react-router-dom";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: "◫" },
  { label: "Projects", path: "/projects", icon: "▣" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <aside className="sidebar glass">
      <div>
        <div className="sidebar-brand">
          <div className="sidebar-logo">A</div>

          <div>
            <strong>ArtifactOS</strong>
            <span>Engineering memory</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          className="upload-button"
          type="button"
          onClick={() => navigate("/projects")}
        >
          <span>＋</span>
          Add artifact
        </button>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
