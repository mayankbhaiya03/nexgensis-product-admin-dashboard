export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="product-card-img"
      />
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <span className="product-card-category">{product.category}</span>
        <div className="product-card-details">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <span className="product-card-meta">Rating: {product.rating}</span>
          <span className="product-card-meta">Stock: {product.stock}</span>
        </div>
        <div className="action-buttons" style={{ marginTop: "0.75rem" }}>
          <button className="btn btn-sm btn-view">View</button>
          <button className="btn btn-sm btn-edit">Edit</button>
          <button className="btn btn-sm btn-delete">Delete</button>
        </div>
      </div>
    </div>
  );
}
