"use client";

export default function DeleteConfirmModal({
  isOpen,
  product = null,
  onClose,
  onConfirm,
  loading = false,
  error = "",
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-delete" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title delete-title">Delete Product</h2>
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

        <div className="delete-body">
          <p className="delete-warning-text">
            Are you sure you want to delete <strong>{product.title}</strong>?
          </p>
          <p className="delete-subtext">
            This action will remove the product from the dashboard catalog.
          </p>
        </div>

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
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(product.id)}
            disabled={loading}
          >
            {loading ? "Deleting product..." : "Yes, Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
