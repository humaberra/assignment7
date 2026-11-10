import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useCartStore, selectItemCount } from "../store/cartStore.js";

const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

export default function NavBar({ theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
    // Selector returns a number, so NavBar re-renders only when the count changes.
  const itemCount = useCartStore(selectItemCount);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          Cart ({itemCount})
        </NavLink>
      </div>

      <div className="nav-actions">
                <button type="button" onClick={onToggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {user ? (
          <>
            <span className="username">{user.username}</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}