"use client";

export default function ProductFilters({
  search,
  searchInput,
  onSearchInputChange,
  onClearSearch,
  category,
  categories,
  onCategoryChange,
  sort,
  order,
  onSortChange,
  onClearAll,
}) {
  const hasActiveFilters = Boolean(search || category || sort);

  return (
    <div className="filters-container">
      {/* Search Input */}
      <div className="search-group">
        <label htmlFor="product-search" className="filter-label">
          Search
        </label>
        <div className="search-input-wrapper">
          <input
            id="product-search"
            type="text"
            className="filter-input search-input"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={onClearSearch}
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="filter-group">
        <label htmlFor="category-select" className="filter-label">
          Category
        </label>
        <select
          id="category-select"
          className="filter-select"
          value={category || ""}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => {
            const slug = typeof cat === "object" ? cat.slug : cat;
            const name = typeof cat === "object" ? cat.name : cat;
            return (
              <option key={slug} value={slug}>
                {name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Sort By Dropdown */}
      <div className="filter-group">
        <label htmlFor="sort-select" className="filter-label">
          Sort by
        </label>
        <select
          id="sort-select"
          className="filter-select"
          value={sort || ""}
          onChange={(e) => {
            const newSort = e.target.value;
            onSortChange(newSort, newSort ? (order || "asc") : "");
          }}
        >
          <option value="">Default</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Order Dropdown */}
      {sort && (
        <div className="filter-group">
          <label htmlFor="order-select" className="filter-label">
            Order
          </label>
          <select
            id="order-select"
            className="filter-select"
            value={order || "asc"}
            onChange={(e) => onSortChange(sort, e.target.value)}
          >
            <option value="asc">Ascending (A–Z / Low–High)</option>
            <option value="desc">Descending (Z–A / High–Low)</option>
          </select>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="filter-group-action">
          <button
            type="button"
            className="btn btn-sm btn-clear-filters"
            onClick={onClearAll}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
