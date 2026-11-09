import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";

export default function Layout() {
  return (
    <div className="app theme-light">
      <NavBar />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        Web Programming - Assignment 7 · Hüma Berra Kolukısa · 230408056
      </footer>
    </div>
  );
}