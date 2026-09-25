"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { getProducts, searchProducts, getCategories } from "@/services/products";
import { parseProductParams, clampPage } from "@/lib/pagination";
import Navbar from "@/components/Navbar";
import ProductFilters from "@/components/ProductFilters";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse all query params from URL
  const { page, limit, search, category, sort, order, delay } = parseProductParams(searchParams);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(search);

  // Request ID ref to prevent stale response race conditions
  const latestRequestId = useRef(0);

  // Synchronize local search input with URL search param (e.g. on Back/Forward or category clear)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Auth check on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  // Load categories list on mount
  useEffect(() => {
    if (checkingAuth) return;
    let isMounted = true;
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const data = await getCategories(controller.signal);
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        if (!axios.isCancel(err) && err?.name !== "CanceledError") {
          console.error("Failed to load categories:", err);
        }
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [checkingAuth]);

  // Helper to update query parameters in URL
  const updateURL = useCallback(
    (newParams, replace = false) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const url = queryString ? `/products?${queryString}` : "/products";
      if (replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router, searchParams]
  );

  // Debounce search input -> update URL query param
  useEffect(() => {
    // Avoid redundant update if input already matches current URL search
    if (searchInput === search) return;

    const timer = setTimeout(() => {
      // Searching clears category and resets to page 1
      updateURL({
        search: searchInput.trim(),
        category: "",
        page: 1,
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [searchInput, search, updateURL]);

  // Main data fetching effect with AbortController and request ID protection
  useEffect(() => {
    if (checkingAuth) return;

    const controller = new AbortController();
    const currentRequestId = ++latestRequestId.current;

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const skip = (page - 1) * limit;
        let data;

        if (search.trim()) {
          data = await searchProducts(
            search.trim(),
            {
              limit,
              skip,
              sortBy: sort || undefined,
              order: sort ? order : undefined,
              delay,
            },
            controller.signal
          );
        } else {
          data = await getProducts(
            {
              limit,
              skip,
              category: category || undefined,
              sortBy: sort || undefined,
              order: sort ? order : undefined,
              delay,
            },
            controller.signal
          );
        }

        // Only update state if this is still the most recent request
        if (currentRequestId === latestRequestId.current) {
          const totalPages = Math.ceil((data.total || 0) / limit);
          const validPage = clampPage(page, totalPages);

          if (validPage !== page && data.total > 0) {
            updateURL({ page: validPage }, true);
            return;
          }

          setProducts(data.products || []);
          setTotal(data.total || 0);
          setLoading(false);
        }
      } catch (err) {
        if (
          axios.isCancel(err) ||
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED"
        ) {
          // Request was aborted due to a newer request or unmount; ignore
          return;
        }

        if (currentRequestId === latestRequestId.current) {
          setError("Something went wrong while loading products.");
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [checkingAuth, page, limit, search, category, sort, order, delay, updateURL]);

  // Handler functions
  function handleSearchInputChange(val) {
    setSearchInput(val);
  }

  function handleClearSearch() {
    setSearchInput("");
    updateURL({ search: "", page: 1 });
  }

  function handleCategoryChange(newCategory) {
    setSearchInput("");
    updateURL({
      category: newCategory,
      search: "",
      page: 1,
    });
  }

  function handleSortChange(newSort, newOrder) {
    updateURL({
      sort: newSort,
      order: newSort ? newOrder || "asc" : "",
      page: 1,
    });
  }

  function handleClearAll() {
    setSearchInput("");
    updateURL({
      search: "",
      category: "",
      sort: "",
      order: "",
      page: 1,
    });
  }

  function handlePageChange(newPage) {
    updateURL({ page: newPage });
  }

  function handleLimitChange(newLimit) {
    updateURL({ page: 1, limit: newLimit });
  }

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-content">
        <h1 className="dashboard-heading">Products Dashboard</h1>

        {/* Filter, Search & Sort Bar */}
        <ProductFilters
          search={search}
          searchInput={searchInput}
          onSearchInputChange={handleSearchInputChange}
          onClearSearch={handleClearSearch}
          category={category}
          categories={categories}
          onCategoryChange={handleCategoryChange}
          sort={sort}
          order={order}
          onSortChange={handleSortChange}
          onClearAll={handleClearAll}
        />

        {/* Loading State */}
        {loading && (
          <div className="state-message">Loading products...</div>
        )}

        {/* Error State */}
        {error && (
          <div className="state-message state-error">
            <p>{error}</p>
            <button
              onClick={() => updateURL({ _retry: Date.now() }, true)}
              className="btn btn-retry"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="state-message">
            <p>No products found matching your criteria.</p>
            {(search || category || sort) && (
              <button
                type="button"
                onClick={handleClearAll}
                className="btn btn-sm btn-clear-filters"
                style={{ marginTop: "0.75rem" }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && products.length > 0 && (
          <>
            {/* Desktop table with sortable headers */}
            <div className="desktop-only">
              <ProductTable
                products={products}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Mobile cards */}
            <div className="mobile-only">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="state-message">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
