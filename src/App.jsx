import { Route, Routes } from "react-router";
import ProductDetail from "./pages/ProductDetail.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductList from "./pages/ProductList.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products">
          <Route index element={<ProductList />} />
          <Route path=":id" element={<ProductDetail />} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}