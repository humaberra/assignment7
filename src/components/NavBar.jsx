import { NavLink } from "react-router";

const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/cart" className={linkClass}>
          Cart
        </NavLink>
      </div>
    </nav>
  );
}