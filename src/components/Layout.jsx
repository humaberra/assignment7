import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";
import useLocalStorage from "../hooks/useLocalStorage.js";

export default function Layout() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className={`app theme-${theme}`}>
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        Web Programming - Assignment 7 · Hüma Berra Kolukısa · 230408056
      </footer>
    </div>
  );
}