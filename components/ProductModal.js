"use client";

import { useState, useEffect } from "react";

export default function ProductModal({
  isOpen,
  mode = "add", // "add" | "edit"
  product = null,
  categories = [],
  onClose,
  onSave,
  loading = false,
  error = "",
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    rating: "4.5",
    stock: "50",
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price !== undefined ? String(product.price) : "",
        category: product.category || (categories[0]?.slug || categories[0] || ""),
        rating: product.rating !== undefined ? String(product.rating) : "4.5",
        stock: product.stock !== undefined ? String(product.stock) : "50",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        category: categories[0]?.slug || categories[0] || "beauty",
        rating: "4.5",
        stock: "50",
      });
    }
    setValidationErrors({});
  }, [product, mode, isOpen, categories]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validate() {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Product title is required.";
    }

    if (!formData.description.trim()) {
      errors.description = "Product description is required.";
    }

    const parsedPrice = parseFloat(formData.price);
    if (!formData.price || isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = "Price must be a valid positive number.";
    }

    if (!formData.category) {
      errors.category = "Please select a category.";
    }

    const parsedRating = parseFloat(formData.rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      errors.rating = "Rating must be between 0.0 and 5.0.";
    }

    const parsedStock = parseInt(formData.stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      errors.stock = "Stock must be a non-negative integer.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      rating: parseFloat(formData.rating),
      stock: parseInt(formData.stock, 10),
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="modal-error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="modal-title" className="form-label">
              Title <span className="req">*</span>
            </label>
            <input
              id="modal-title"
              name="title"
              type="text"
              className={`form-input ${validationErrors.title ? "input-error" : ""}`}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
            />
            {validationErrors.title && (
              <span className="error-text">{validationErrors.title}</span>
            )}
          </div>

          {/* Category & Price Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-category" className="form-label">
                Category <span className="req">*</span>
              </label>
              <select
                id="modal-category"
                name="category"
                className={`form-select ${validationErrors.category ? "input-error" : ""}`}
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
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
              {validationErrors.category && (
                <span className="error-text">{validationErrors.category}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="modal-price" className="form-label">
                Price ($) <span className="req">*</span>
              </label>
              <input
                id="modal-price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                className={`form-input ${validationErrors.price ? "input-error" : ""}`}
                placeholder="29.99"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.price && (
                <span className="error-text">{validationErrors.price}</span>
              )}
            </div>
          </div>

          {/* Rating & Stock Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-rating" className="form-label">
                Rating (0–5) <span className="req">*</span>
              </label>
              <input
                id="modal-rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                className={`form-input ${validationErrors.rating ? "input-error" : ""}`}
                placeholder="4.5"
                value={formData.rating}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.rating && (
                <span className="error-text">{validationErrors.rating}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="modal-stock" className="form-label">
                Stock Count
              </label>
              <input
                id="modal-stock"
                name="stock"
                type="number"
                min="0"
                className={`form-input ${validationErrors.stock ? "input-error" : ""}`}
                placeholder="50"
                value={formData.stock}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.stock && (
                <span className="error-text">{validationErrors.stock}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="modal-description" className="form-label">
              Description <span className="req">*</span>
            </label>
            <textarea
              id="modal-description"
              name="description"
              rows={3}
              className={`form-textarea ${validationErrors.description ? "input-error" : ""}`}
              placeholder="Provide key product features, specs, and details..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
            {validationErrors.description && (
              <span className="error-text">{validationErrors.description}</span>
            )}
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? mode === "edit"
                  ? "Saving changes..."
                  : "Adding product..."
                : mode === "edit"
                ? "Save Changes"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
