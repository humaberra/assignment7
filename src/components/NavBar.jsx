import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          Cart
        </NavLink>
      </div>

      <div className="nav-actions">
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