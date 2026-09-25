import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-card-img"
        />
      </Link>
      <div className="product-card-body">
        <h3 className="product-card-title">
          <Link href={`/products/${product.id}`} className="product-title-link">
            {product.title}
          </Link>
        </h3>
        <span className="product-card-category">{product.category}</span>
        <div className="product-card-details">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <span className="product-card-meta">Rating: {product.rating}</span>
          <span className="product-card-meta">Stock: {product.stock}</span>
        </div>
        <div className="action-buttons" style={{ marginTop: "0.75rem" }}>
          <Link href={`/products/${product.id}`} className="btn btn-sm btn-view">
            View
          </Link>
          <button className="btn btn-sm btn-edit">Edit</button>
          <button className="btn btn-sm btn-delete">Delete</button>
        </div>
      </div>
    </div>
  );
}
