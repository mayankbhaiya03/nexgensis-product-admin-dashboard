const ALLOWED_LIMITS = [10, 20, 50];
const ALLOWED_SORTS = ["title", "price", "rating"];
const ALLOWED_ORDERS = ["asc", "desc"];

// Parse and validate all product query params from URL search params
export function parseProductParams(searchParams) {
  let page = parseInt(searchParams.get("page"), 10);
  let limit = parseInt(searchParams.get("limit"), 10);
  let search = (searchParams.get("search") || searchParams.get("q") || "").trim();
  let category = (searchParams.get("category") || "").trim();
  let sort = (searchParams.get("sort") || searchParams.get("sortBy") || "").trim().toLowerCase();
  let order = (searchParams.get("order") || "").trim().toLowerCase();
  let delay = parseInt(searchParams.get("delay"), 10);

  // Validate limit
  if (!ALLOWED_LIMITS.includes(limit)) {
    limit = 10;
  }

  // Validate page
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Validate category ("all" or empty is treated as none)
  if (category === "all") {
    category = "";
  }

  // Validate sort
  if (!ALLOWED_SORTS.includes(sort)) {
    sort = "";
  }

  // Validate order (default to "asc" if sort is active, otherwise empty)
  if (sort) {
    if (!ALLOWED_ORDERS.includes(order)) {
      order = "asc";
    }
  } else {
    order = "";
  }

  return {
    page,
    limit,
    search,
    category,
    sort,
    order,
    delay: isNaN(delay) ? undefined : delay,
  };
}

// Backward compatibility alias for page/limit
export function parsePageParams(searchParams) {
  const { page, limit } = parseProductParams(searchParams);
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
