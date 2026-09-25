"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/services/products";
import Navbar from "@/components/Navbar";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  // Fetch products after auth check passes
  useEffect(() => {
    if (!checkingAuth) {
      fetchProducts();
    }
  }, [checkingAuth]);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts({ limit: 30 });
      setProducts(data.products);
    } catch (err) {
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
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
          </>
        )}
      </main>
    </div>
  );
}
