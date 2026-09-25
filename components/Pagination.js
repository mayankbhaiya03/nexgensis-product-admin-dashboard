import { getPageNumbers } from "@/lib/pagination";

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing {start}–{end} of {total}
      </div>

      <div className="pagination-controls">
        <button
          className="btn btn-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>

        <div className="pagination-pages">
          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="pagination-dots">
                …
              </span>
            ) : (
              <button
                key={p}
                className={`btn btn-sm ${p === page ? "btn-page-active" : ""}`}
                onClick={() => onPageChange(p)}
                disabled={p === page}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          className="btn btn-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      <div className="pagination-limit">
        <label htmlFor="pageSize">Items per page:</label>
        <select
          id="pageSize"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="pagination-select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
