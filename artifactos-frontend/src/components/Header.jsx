export default function Header({
  search,
  onSearchChange,
  artifactCount,
}) {
  return (
    <header className="dashboard-header glass">
      <div>
        <p className="dashboard-eyebrow">YOUR WORKSPACE</p>
        <h1>Engineering knowledge, organized.</h1>
      </div>

      <div className="header-actions">
        <label className="search-field">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Search artifacts..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <div className="artifact-total">
          <strong>{artifactCount}</strong>
          <span>Artifacts</span>
        </div>
      </div>
    </header>
  );
}