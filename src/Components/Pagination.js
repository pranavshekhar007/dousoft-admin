import React from "react";

const Pagination = ({
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  pageCount = 10,
  onPageCountChange,
  siblingCount = 1, // how many pages to show around active
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
}) => {
  // Helper for building pages with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(2, currentPage - siblingCount);
    let endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    // Always show 1
    pages.push(1);

    // Add left ellipsis
    if (startPage > 2) {
      pages.push("left-ellipsis");
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add right ellipsis
    if (endPage < totalPages - 1) {
      pages.push("right-ellipsis");
    }

    // Always show totalPages (if more than 1)
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-5 px-3 py-3 mt-4">
      {showPageSize && (
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold text-secondary">Show</span>
          <select
            className="form-select form-select-sm custom-select"
            value={pageCount}
            onChange={e => onPageCountChange(Number(e.target.value))}
          >
            {pageSizeOptions.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}

      <nav>
        <ul className="pagination pagination-sm mb-0 custom-pagination">
          {/* Previous */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
          </li>
          {/* Page buttons */}
          {getPageNumbers().map((page, idx) =>
            typeof page === "string" ? (
              <li key={page + idx} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            )
          )}
          {/* Next */}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
