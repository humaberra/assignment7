import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { login } from "../api/authApi.js";

export default function Login() {
  const { user, loggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Where the user originally wanted to go (set by ProtectedRoute), or home.
  const from = location.state?.from?.pathname
    ? location.state.from.pathname + (location.state.from.search ?? "")
    : "/";

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await login(username, password);
      loggedIn(loggedUser);
      // replace: the login page is not left in the browser history.
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username (student email)
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {error && <p className="status error">{error}</p>}
    </section>
  );
}