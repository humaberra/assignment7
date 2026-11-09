import useFetch from "../hooks/useFetch.js";
import { fetchProducts } from "../api/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductList() {
  const { loading, error, data: products } = useFetch((signal) => fetchProducts(signal), []);

  if (loading) return <p className="status">Loading products...</p>;
  if (error) return <p className="status error">Could not load products: {error.message}</p>;
  if (products.length === 0) return <p className="status">No products found.</p>;

  return (
    <section>
      <h1>Products</h1>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}