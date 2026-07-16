export default function ArtifactForm({
  form,
  editingId,
  saving,
  error,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="artifact-form-panel glass">
      <div className="artifact-form-heading">
        <div>
          <p className="dashboard-eyebrow">
            {editingId ? "EDIT ARTIFACT" : "NEW ARTIFACT"}
          </p>
          <h2>
            {editingId ? "Update artifact" : "Add engineering knowledge"}
          </h2>
        </div>

        {editingId && (
          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>

      <form className="artifact-form" onSubmit={onSubmit}>
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Example: Authentication Flow"
            required
          />
        </label>

        <label>
          Type
          <select
            name="artifact_type"
            value={form.artifact_type}
            onChange={onChange}
            required
          >
            <option value="diagram">Diagram</option>
            <option value="markdown">Markdown</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="code">Code</option>
          </select>
        </label>

        <label>
          Filename
          <input
            name="filename"
            value={form.filename}
            onChange={onChange}
            placeholder="auth-flow.drawio"
          />
        </label>

        <label className="artifact-description-field">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Explain what this artifact contains."
            rows={4}
          />
        </label>

        <label className="artifact-description-field">
          Text content
          <textarea
            name="text_content"
            value={form.text_content}
            onChange={onChange}
            placeholder="Optional notes, code, SQL, or markdown."
            rows={6}
          />
        </label>

        {error && <p className="artifact-form-error">{error}</p>}

        <button
          className="primary-button"
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingId
              ? "Save changes"
              : "Create artifact"}
        </button>
      </form>
    </section>
  );
}
