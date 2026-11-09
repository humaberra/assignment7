// Pure API layer: no React, no JSX.
const BASE_URL = "https://dummyjson.com/products";

// fetch() only rejects on network failure, so a 404/500 must be turned into an error by hand.
async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? "Product not found"
        : `Request failed with status ${response.status}`
    );
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchProducts(signal) {
  const data = await getJson(`${BASE_URL}?limit=100`, signal);
  return data.products;
}

export async function fetchProduct(id, signal) {
  return getJson(`${BASE_URL}/${encodeURIComponent(id)}`, signal);
}