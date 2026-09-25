import Link from "next/link";

export default function ProductTable({ products, sort, order, onSortChange }) {
  function handleHeaderClick(field) {
    if (!onSortChange) return;
    if (sort !== field) {
      onSortChange(field, "asc");
    } else if (order === "asc") {
      onSortChange(field, "desc");
    } else {
      onSortChange("", "");
    }
  }

  function renderSortIcon(field) {
    if (sort !== field) {
      return <span className="sort-icon-muted">⇅</span>;
    }
    return <span className="sort-icon-active">{order === "desc" ? "▼" : "▲"}</span>;
  }

  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th
              className="sortable-header"
              onClick={() => handleHeaderClick("title")}
              title="Sort by Title"
            >
              Title {renderSortIcon("title")}
            </th>
            <th>Category</th>
            <th
              className="sortable-header"
              onClick={() => handleHeaderClick("price")}
              title="Sort by Price"
            >
              Price {renderSortIcon("price")}
            </th>
            <th
              className="sortable-header"
              onClick={() => handleHeaderClick("rating")}
              title="Sort by Rating"
            >
              Rating {renderSortIcon("rating")}
            </th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="product-thumb"
                  />
                </Link>
              </td>
              <td className="product-title-cell">
                <Link href={`/products/${product.id}`} className="product-title-link">
                  {product.title}
                </Link>
              </td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.rating}</td>
              <td>{product.stock}</td>
              <td>
                <div className="action-buttons">
                  <Link
                    href={`/products/${product.id}`}
                    className="btn btn-sm btn-view"
                  >
                    View
                  </Link>
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
