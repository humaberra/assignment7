import { Link } from "react-router";
import { useCartStore, selectTotalPrice } from "../store/cartStore.js";

export default function Cart() {
  // Each selector returns an existing reference or a primitive.
  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectTotalPrice);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p className="status">Your cart is empty.</p>
        <Link to="/products">← Browse products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <span className="cart-title">{item.title}</span>
            <span>${item.price.toFixed(2)}</span>
            <div className="qty">
              <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
            <button type="button" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="total">Total: ${total.toFixed(2)}</p>
      <button type="button" onClick={clear}>
        Clear cart
      </button>
    </section>
  );
}