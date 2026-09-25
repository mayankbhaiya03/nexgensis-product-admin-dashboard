const ALLOWED_LIMITS = [10, 20, 50];

// Parse and validate page/limit from URL search params
export function parsePageParams(searchParams) {
  let page = parseInt(searchParams.get("page"), 10);
  let limit = parseInt(searchParams.get("limit"), 10);

  // Validate limit — must be one of the allowed values
  if (!ALLOWED_LIMITS.includes(limit)) {
    limit = 10;
  }

  // Validate page — must be a positive integer
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  return { page, limit };
}

// Clamp page to valid range after we know the total
export function clampPage(page, totalPages) {
  if (totalPages === 0) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

// Build a page number array like: [1, 2, 3, "...", 10]
export function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];

  // Always show first page
  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  // Pages around current
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}
