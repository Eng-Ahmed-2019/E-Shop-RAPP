import React, { useEffect, useState } from "react";
import productsApi from "../../services/productsApi";
import categoriesApi from "../../services/categoriesApi";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../services/authService";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
        setError("⚠️ Failed to load products or categories");
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndCategories();
  }, []);

  const visibleProducts = products.filter((p) => {
    const matchCategory = selectedCategoryId ? String(p.categoryId) === String(selectedCategoryId) : true;
    const matchSearch = searchTerm.trim() === "" ? true : (p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

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

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>
        Loading products...
      </p>
    );
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", fontWeight: 600 }}>
        {error}
      </p>
    );

  return (
    <div
      style={{
        padding: "50px 40px",
        background: "linear-gradient(135deg, #f6f7fb, #f0f2f8)",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 10,
          gap: 12,
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: "bold",
            color: "#333",
            letterSpacing: 0.5,
          }}
        >
          🛒 Product Management
        </h2>
        {/* شريط البحث */}
        <input
          type="text"
          placeholder="🔎 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: "#fff",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 16,
            minWidth: 185,
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0,0,0,0.045)",
            outline: "none",
            color: "#3b3b3b",
            marginRight: 12,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label
            htmlFor="categoryFilter"
            style={{ color: "#444", fontWeight: 600 }}
          >
            Category:
          </label>
          <select
            id="categoryFilter"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              minWidth: 180,
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {admin && (
          <button
            onClick={() => navigate("/products/add")}
            style={{
              backgroundColor: "#3b82f6",
              border: "none",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(59,130,246,0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          >
            ➕ Add Product
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 25
        }}
      >
        {visibleProducts.length > 0 ? (
          visibleProducts.map((prod) => (
            <div
              key={prod.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.25s, box-shadow 0.25s"
              }}
              onClick={() => navigate(`/products/${prod.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(0,0,0,0.1)";
              }}
            >
              <h3
                style={{
                  color: "#111",
                  fontSize: "1.3rem",
                  marginBottom: 10,
                  fontWeight: 600
                }}
              >
                {prod.name}
              </h3>
              <p style={{ color: "#555", fontSize: 14, marginBottom: 6 }}>
                {prod.description || "No description available."}
              </p>
              <p style={{ color: "#007bff", fontWeight: "bold" }}>
                💲 Price: ${prod.price}
              </p>
              <p style={{ color: "#666", fontSize: 14 }}>
                Stock: <b>{prod.stock}</b>
              </p>
              <p style={{ color: "#888", fontSize: 14 }}>
                Category:{" "}
                {
                  categories.find((cat) => cat.id === prod.categoryId)?.name ||
                  prod.categoryName ||
                  prod.categoryId
                }
              </p>

              {admin && (
                <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/edit/${prod.id}`);
                    }}
                    style={{
                      backgroundColor: "#10b981",
                      border: "none",
                      color: "#fff",
                      padding: "8px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "background 0.3s ease"
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#059669")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#10b981")
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, prod.id, prod.name)}
                    style={{
                      backgroundColor: "#ef4444",
                      border: "none",
                      color: "#fff",
                      padding: "8px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "background 0.3s ease"
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#dc2626")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ef4444")
                    }
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              fontWeight: "bolder",
              color: "#b91c1c",
              fontStyle: "italic",
              background: "#fff0f3",
              borderRadius: 12,
              padding: "18px 0",
              gridColumn: "1 / -1",
              fontSize: 18,
              boxShadow: "0 2px 8px 0 #f36f6f11",
            }}
          >
            {searchTerm.trim()
              ? `No products found for "${searchTerm}".`
              : "No products found."}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductsList;