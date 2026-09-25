import api from "@/lib/axios";

// GET /products — with pagination, sorting, and optional category filter
export async function getProducts({ limit = 10, skip = 0, sortBy, order, category, delay } = {}, signal) {
  const params = { limit, skip };
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  if (delay) params.delay = delay;

  // DummyJSON uses a different endpoint for category filtering
  const url = category ? `/products/category/${encodeURIComponent(category)}` : "/products";
  const res = await api.get(url, { params, signal });
  return res.data;
}

// GET /products/search?q= — search products by query with pagination and sorting
export async function searchProducts(query, { limit = 10, skip = 0, sortBy, order, delay } = {}, signal) {
  const params = { q: query, limit, skip };
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  if (delay) params.delay = delay;

  const res = await api.get("/products/search", {
    params,
    signal,
  });
  return res.data;
}

// GET /products/:id — single product details
export async function getProductById(id, signal) {
  const res = await api.get(`/products/${id}`, { signal });
  return res.data;
}

// GET /products/categories — list of all categories
export async function getCategories(signal) {
  const res = await api.get("/products/categories", { signal });
  return res.data;
}

// POST /products/add — create a new product
export async function addProduct(productData) {
  const res = await api.post("/products/add", productData);
  return res.data;
}

// PUT /products/:id — update an existing product
export async function updateProduct(id, productData) {
  const res = await api.put(`/products/${id}`, productData);
  return res.data;
}

// DELETE /products/:id — delete a product
export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}
