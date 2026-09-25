export default function ProductTable({ products }) {
  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="product-thumb"
                />
              </td>
              <td className="product-title-cell">{product.title}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.rating}</td>
              <td>{product.stock}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn btn-sm btn-view">View</button>
                  <button className="btn btn-sm btn-edit">Edit</button>
                  <button className="btn btn-sm btn-delete">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
