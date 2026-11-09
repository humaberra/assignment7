import { Link } from "react-router";

export default function Home() {
  return (
    <section>
      <h1>Welcome to the Mini Shop</h1>
      <p>Browse the catalogue, filter products and add them to your cart.</p>
      <p>
        <Link to="/products">Go to products →</Link>
      </p>
    </section>
  );
}