import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import LowStockProducts from "./pages/LowStockProducts";
import ActiveProducts from "./pages/ActiveProducts";
import CategoryProducts from "./pages/CategoryProducts";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/low-stock" element={<LowStockProducts />} />
          <Route path="/active-products" element={<ActiveProducts />} />
          <Route path="category-products/:id" element={<CategoryProducts />} />
        </Routes>
      </div>
    </Router>
  );
}
