import "./Pagination.css";

export default function Pagination({
  page,
  pages,
  total,
  itemLabel = "items",
  onPrevious,
  onNext,
}) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label={`${itemLabel} pagination`}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={page <= 1}
      >
        ← Previous
      </button>

      <div className="pagination-status" aria-live="polite">
        <strong>
          Page {page} of {pages}
        </strong>

        {typeof total === "number" && (
          <span>
            {total} {itemLabel}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={page >= pages}
      >
        Next →
      </button>
    </nav>
  );
}
