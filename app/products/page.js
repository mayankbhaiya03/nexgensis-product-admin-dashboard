"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts } from "@/services/products";
import { parsePageParams, clampPage } from "@/lib/pagination";
import Navbar from "@/components/Navbar";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Read page and limit from URL (validated)
  const { page: rawPage, limit } = parsePageParams(searchParams);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  // Fetch products when page or limit changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const skip = (rawPage - 1) * limit;
      const data = await getProducts({ limit, skip });

      // If the requested page is beyond the actual total, clamp it
      const totalPages = Math.ceil(data.total / limit);
      const validPage = clampPage(rawPage, totalPages);

      if (validPage !== rawPage) {
        // Redirect to valid page without adding to history
        updateURL(validPage, limit, true);
        return;
      }

      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  }, [rawPage, limit]);

  useEffect(() => {
    if (!checkingAuth) {
      fetchProducts();
    }
  }, [checkingAuth, fetchProducts]);

  // Update URL search params — preserves any other params
  function updateURL(newPage, newLimit, replace = false) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    params.set("limit", newLimit);
    const url = `/products?${params.toString()}`;
    if (replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  }

  function handlePageChange(newPage) {
    updateURL(newPage, limit);
  }

  function handleLimitChange(newLimit) {
    // Reset to page 1 when changing page size
    updateURL(1, newLimit);
  }

  // Don't render anything while checking auth
  if (checkingAuth) {
    return null;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-content">
        {loading && (
          <div className="state-message">Loading products...</div>
        )}

        {error && (
          <div className="state-message state-error">
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn btn-retry">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="state-message">No products found.</div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="desktop-only">
              <ProductTable products={products} />
            </div>

            {/* Mobile cards */}
            <div className="mobile-only">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              page={rawPage}
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
