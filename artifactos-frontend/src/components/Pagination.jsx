export default function Pagination({
  page,
  pages,
  onPrevious,
  onNext,
}) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={onPrevious}
        disabled={page <= 1}
      >
        Previous
      </button>

      <span>
        Page {page} of {pages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={page >= pages}
      >
        Next
      </button>
    </nav>
  );
}
