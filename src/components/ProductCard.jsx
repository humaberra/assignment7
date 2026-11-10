import { Link } from "react-router";
import { useCartStore } from "../store/cartStore.js";

export default function ProductCard({ product }) {
  // Only the action is selected: adding items does not re-render every card.
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.thumbnail} alt={product.title} width="150" height="150" />
        <h3>{product.title}</h3>
      </Link>
      <p className="category">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button type="button" onClick={() => addItem(product)}>
        Add to cart
      </button>
    </article>
  );
}