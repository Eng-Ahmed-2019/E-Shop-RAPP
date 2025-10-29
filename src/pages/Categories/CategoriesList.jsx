import React, { useEffect, useState } from "react";
import categoriesApi from "../../services/categoriesApi";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../services/authService";

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
  const response = await categoriesApi.get("/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Categories fetch error:", err);
        // Try to show a helpful message from the server if available
        const serverMsg = err.response?.data?.message || err.response?.data || err.message;
        setError(serverMsg || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading categories...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

const handleDelete = async (e, id, name) => {
  e.stopPropagation();
  const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
  if (!confirmDelete) return;

  try {
  await categoriesApi.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    alert("✅ Category deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("❌ Failed to delete category. Please try again.");
  }
};

  const admin = isAdmin();

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(to right, #667eea, #764ba2)",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    }}
  >
    <h2 style={{ fontSize: "2rem" }}>📦 Categories</h2>
    {admin && (
  <button
    onClick={() => navigate("/categories/add")}
    style={{
      backgroundColor: "#4CAF50",
      border: "none",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      marginBottom: "20px",
    }}
  >
    ➕ Add Category
  </button>
)}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {categories.length > 0 ? (
          categories.map((cat) => (
  <div
    key={cat.id}
    style={{
      background: "rgba(255,255,255,0.1)",
      borderRadius: "15px",
      padding: "20px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      transition: "transform 0.2s ease",
      cursor: "pointer",
    }}
    onClick={() => navigate(`/categories/${cat.id}`)}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <h3 style={{ color: "#fff", marginBottom: "10px" }}>{cat.name}</h3>
    <p style={{ color: "#ddd" }}>
      {cat.description || "No description available"}
    </p>

    {/* 🧩 أزرار التحكم */}
    {admin && (
  <div style={{ marginTop: "10px" }}>
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/categories/edit/${cat.id}`);
      }}
      style={{
        backgroundColor: "#2196F3",
        border: "none",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        marginRight: "10px",
      }}
    >
      ✏️ Edit
    </button>

    <button
      onClick={(e) => handleDelete(e, cat.id, cat.name)}
      style={{
        backgroundColor: "#f44336",
        border: "none",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      🗑 Delete
    </button>
  </div>
)}

  </div>
))
        ) : (
          <p style={{ textAlign: "center", fontWeight: "bolder" , color: "#000" , fontStyle: "italic" , marginLeft: "70px" }}>No categories found.</p>
        )}
      </div>
    </div>
  );
}

export default CategoriesList;