"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { getProductById } from "@/services/products";
import Navbar from "@/components/Navbar";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
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

  // Fetch single product data
  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    setError("");

    const controller = new AbortController();

    try {
      const data = await getProductById(id, controller.signal);
      if (data && data.id) {
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.thumbnail || "");
      } else {
        setNotFound(true);
      }
    } catch (err) {
      if (axios.isCancel(err) || err?.name === "CanceledError") {
        return;
      }
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError("Failed to load product details. Please try again.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!checkingAuth && id) {
      fetchProduct();
    }
  }, [checkingAuth, id, fetchProduct]);

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-content">
        {/* Navigation Bar */}
        <div className="detail-nav-bar">
          <Link href="/products" className="btn btn-sm btn-back">
            ← Back to Products
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="state-message">Loading product details...</div>
        )}

        {/* Not Found State */}
        {!loading && notFound && (
          <div className="state-message state-error detail-state-box">
            <h2 className="detail-error-title">Product Not Found</h2>
            <p>The product you are looking for does not exist or has been removed.</p>
            <Link
              href="/products"
              className="btn btn-primary"
              style={{ marginTop: "1rem", display: "inline-block" }}
            >
              Back to Products
            </Link>
          </div>
        )}

        {/* Generic Error State */}
        {!loading && !notFound && error && (
          <div className="state-message state-error detail-state-box">
            <p>{error}</p>
            <button onClick={fetchProduct} className="btn btn-retry">
              Retry
            </button>
          </div>
        )}

        {/* Product Details View */}
        {!loading && !notFound && !error && product && (
          <div className="product-detail-container">
            <div className="product-detail-grid">
              {/* Image Gallery */}
              <div className="product-gallery">
                <div className="main-image-wrapper">
                  <img
                    src={selectedImage || product.thumbnail}
                    alt={product.title}
                    className="main-product-image"
                  />
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="gallery-thumbnails">
                    {product.images.map((imgUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`thumbnail-btn ${
                          selectedImage === imgUrl ? "thumbnail-btn-active" : ""
                        }`}
                        onClick={() => setSelectedImage(imgUrl)}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.title} view ${index + 1}`}
                          className="thumbnail-img"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="product-info-pane">
                <div className="detail-meta-top">
                  <span className="detail-category-badge">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="detail-brand">Brand: {product.brand}</span>
                  )}
                  {product.sku && (
                    <span className="detail-sku">SKU: {product.sku}</span>
                  )}
                </div>

                <h1 className="product-detail-title">{product.title}</h1>

                <div className="detail-price-row">
                  <span className="detail-price">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.discountPercentage && (
                    <span className="detail-discount">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <div className="detail-rating-row">
                  <span className="detail-rating-stars">
                    ★ {product.rating}
                  </span>
                  <span className="detail-rating-count">
                    ({product.reviews ? product.reviews.length : 0} reviews)
                  </span>
                  <span
                    className={`detail-stock-badge ${
                      product.stock > 0 ? "in-stock" : "out-of-stock"
                    }`}
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock} available)`
                      : "Out of Stock"}
                  </span>
                </div>

                <div className="detail-section">
                  <h3 className="detail-section-title">Description</h3>
                  <p className="product-description-text">
                    {product.description}
                  </p>
                </div>

                {/* Additional Info / Specs */}
                <div className="detail-specs-grid">
                  {product.warrantyInformation && (
                    <div className="spec-item">
                      <span className="spec-label">Warranty:</span>
                      <span className="spec-value">
                        {product.warrantyInformation}
                      </span>
                    </div>
                  )}
                  {product.shippingInformation && (
                    <div className="spec-item">
                      <span className="spec-label">Shipping:</span>
                      <span className="spec-value">
                        {product.shippingInformation}
                      </span>
                    </div>
                  )}
                  {product.returnPolicy && (
                    <div className="spec-item">
                      <span className="spec-label">Return Policy:</span>
                      <span className="spec-value">{product.returnPolicy}</span>
                    </div>
                  )}
                  {product.availabilityStatus && (
                    <div className="spec-item">
                      <span className="spec-label">Availability:</span>
                      <span className="spec-value">
                        {product.availabilityStatus}
                      </span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="spec-item">
                      <span className="spec-label">Weight:</span>
                      <span className="spec-value">{product.weight}g</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h2 className="reviews-heading">
                Customer Reviews ({product.reviews ? product.reviews.length : 0})
              </h2>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="reviews-grid">
                  {product.reviews.map((rev, index) => (
                    <div key={index} className="review-card">
                      <div className="review-header">
                        <div>
                          <span className="reviewer-name">
                            {rev.reviewerName || "Anonymous"}
                          </span>
                          <span className="review-date">
                            {rev.date
                              ? new Date(rev.date).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                        <span className="review-rating">
                          {"★".repeat(rev.rating)}
                          {"☆".repeat(Math.max(0, 5 - rev.rating))}
                        </span>
                      </div>
                      <p className="review-comment">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reviews-text">No reviews yet for this product.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
