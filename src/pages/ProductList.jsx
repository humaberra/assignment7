import { useSearchParams } from "react-router";
import useFetch from "../hooks/useFetch.js";
import { fetchProducts } from "../api/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductList() {
  const { loading, error, data: products } = useFetch((signal) => fetchProducts(signal), []);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter values live in the URL, not in useState.
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  // Update ONE parameter and keep the others (copy the current params first).
  const updateParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  };

  if (loading) return <p className="status">Loading products...</p>;
  if (error) return <p className="status error">Could not load products: {error.message}</p>;

  // Derived during render: no state, no effect.
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const search = q.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search) && (category === "" || p.category === category)
  );

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search by title..."
          value={q}
          onChange={(e) => updateParam("q", e.target.value)}
        />
        <select value={category} onChange={(e) => updateParam("category", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {(q || category) && (
          <button type="button" onClick={() => setSearchParams({}, { replace: true })}>
            Clear filters
          </button>
        )}
      </div>

      <p className="muted">
        Showing {filtered.length} of {products.length} products
      </p>

      {filtered.length === 0 ? (
        <p className="status">No products match your filters.</p>
      ) : (
        <div className="grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}