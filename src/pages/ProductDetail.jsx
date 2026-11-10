import { Link, useNavigate, useParams } from "react-router";
import useFetch from "../hooks/useFetch.js";
import { fetchProduct } from "../api/productsApi.js";
import { useCartStore } from "../store/cartStore.js";

export default function ProductDetail() {
  const { id } = useParams(); // always a STRING, e.g. "3"
  const navigate = useNavigate();
    const addItem = useCartStore((state) => state.addItem);


  // [id] as dependency: changing the URL from /products/3 to /products/4 refetches.
  const { loading, error, data: product } = useFetch((signal) => fetchProduct(id, signal), [id]);

  const numericId = Number(id);
  const validId = Number.isInteger(numericId) && numericId > 0;

  const backButton = (
    <button type="button" onClick={() => navigate("/products")}>
      ← Back to products
    </button>
  );

  if (loading) return <p className="status">Loading product...</p>;

  if (error) {
    return (
      <section>
        {backButton}
        <p className="status error">
          {error.status === 404 || error.status === 400
            ? `Product not found (id: ${id}).`
            : `Could not load product: ${error.message}`}
        </p>
      </section>
    );
  }

  return (
    <section className="detail">
      {backButton}
      <h1>{product.title}</h1>
      <img src={product.thumbnail} alt={product.title} width="250" />
      <p>{product.description}</p>
      <p>
        <strong>Category:</strong> {product.category}
      </p>
      <p className="price">${product.price.toFixed(2)}</p>
            <button type="button" onClick={() => addItem(product)}>
        Add to cart
      </button>

      <div className="pager">
        {validId && numericId > 1 && <Link to={`/products/${numericId - 1}`}>← Previous product</Link>}
        {validId && <Link to={`/products/${numericId + 1}`}>Next product →</Link>}
      </div>
    </section>
  );
}