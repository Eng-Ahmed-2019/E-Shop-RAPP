import React, { useEffect, useState } from "react";
import productsApi from "../../services/productsApi";
import categoriesApi from "../../services/categoriesApi";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../services/authService";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const admin = isAdmin();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.get("/Products"),
          categoriesApi.get("/categories")
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError("Failed to load products or categories");
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndCategories();
  }, []);

  const visibleProducts = selectedCategoryId
    ? products.filter((p) => String(p.categoryId) === String(selectedCategoryId))
    : products;

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
  await productsApi.delete(`/Products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Product deleted successfully!");
    } catch (error) {
      alert("❌ Failed to delete product. Please try again.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading products...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 40, background: "#f5f6fa", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "2rem" }}>🛒 Products</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label htmlFor="categoryFilter" style={{ color: "#333", fontWeight: 600 }}>Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", minWidth: 180, background: "#fff" }}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {admin && (
          <button
            onClick={() => navigate("/products/add")}
            style={{ backgroundColor: "#4CAF50", border: "none", color: "#fff", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
          >
            ➕ Add Product
          </button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
        {visibleProducts.length > 0 ? (
          visibleProducts.map((prod) => (
            <div
              key={prod.id}
              style={{ background: "#fff", borderRadius: 15, padding: 20, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => navigate(`/products/${prod.id}`)}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ color: "#333", marginBottom: 10 }}>{prod.name}</h3>
              <p style={{ color: "#666", fontSize: 15 }}>{prod.description || "No description"}</p>
              <p style={{ color: "#007bff", fontWeight: "bold" }}>Price: ${prod.price}</p>
              <p style={{ color: "#888" }}>Stock: {prod.stock}</p>
              <p style={{ color: "#888" }}>
                Category: {
                  categories.find((cat) => cat.id === prod.categoryId)?.name || prod.categoryName || prod.categoryId
                }
              </p>
              {admin && (
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/products/edit/${prod.id}`); }}
                    style={{ backgroundColor: "#2196F3", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: "bold", marginRight: 10 }}
                  >✏️ Edit</button>
                  <button
                    onClick={e => handleDelete(e, prod.id, prod.name)}
                    style={{ backgroundColor: "#f44336", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}
                  >🗑 Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", fontWeight: "bolder", color: "#000", fontStyle: "italic" }}>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default ProductsList;