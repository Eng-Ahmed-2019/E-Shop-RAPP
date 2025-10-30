import React, { useEffect, useState } from "react";
import categoriesApi from "../../services/categoriesApi";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../services/authService";

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.get("/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Categories fetch error:", err);
        const serverMsg =
          err.response?.data?.message || err.response?.data || err.message;
        setError(serverMsg || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
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

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // 🎨 التنسيقات الاحترافية الموحدة
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif",
    padding: "40px",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "600",
    letterSpacing: "1px",
  };

  const addButtonStyle = {
    background: "linear-gradient(90deg, #4CAF50, #2e8b57)",
    border: "none",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  };

  const hoverAdd = (e, hover) => {
    e.target.style.background = hover
      ? "linear-gradient(90deg, #3e8e41, #1e6931)"
      : "linear-gradient(90deg, #4CAF50, #2e8b57)";
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  };

  const cardHover = (e, hover) => {
    e.currentTarget.style.transform = hover ? "scale(1.05)" : "scale(1)";
    e.currentTarget.style.boxShadow = hover
      ? "0 10px 25px rgba(0,0,0,0.4)"
      : "0 8px 20px rgba(0,0,0,0.3)";
  };

  const btnStyle = {
    padding: "7px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#fff",
    transition: "0.3s",
  };

  const editBtn = {
    ...btnStyle,
    backgroundColor: "#2196F3",
    marginRight: "10px",
  };

  const delBtn = {
    ...btnStyle,
    backgroundColor: "#f44336",
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "80px", fontSize: "18px" }}>
        ⏳ Loading categories...
      </p>
    );

  if (error)
    return (
      <p
        style={{
          textAlign: "center",
          color: "#ff4d4f",
          fontWeight: "bold",
          marginTop: "50px",
        }}
      >
        {error}
      </p>
    );

  return (
    <div style={pageStyle}>
      <div style={{...headerStyle, gap: 19}}>
        <h2 style={titleStyle}>📦 Categories</h2>
        {/* شريط البحث */}
        <input
          type="text"
          placeholder="🔎 Search categories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            background: "#fff",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 15,
            minWidth: 185,
            border: "1px solid #ccc",
            color: "#333",
            boxShadow: "0 2px 6px rgba(0,0,0,0.045)",
            outline: "none",
            marginRight: 17
          }}
        />
        {admin && (
          <button
            style={addButtonStyle}
            onClick={() => navigate("/categories/add")}
            onMouseEnter={e => hoverAdd(e, true)}
            onMouseLeave={e => hoverAdd(e, false)}
          >
            ➕ Add Category
          </button>
        )}
      </div>
      {/* النتائج */}
      {filteredCategories.length > 0 ? (
        <div style={gridStyle}>
          {filteredCategories.map(cat => (
            <div
              key={cat.id}
              style={cardStyle}
              onClick={() => navigate(`/categories/${cat.id}`)}
              onMouseEnter={e => cardHover(e, true)}
              onMouseLeave={e => cardHover(e, false)}
            >
              <h3
                style={{
                  marginBottom: "10px",
                  fontSize: "18px",
                  fontWeight: "600"
                }}
              >
                {cat.name}
              </h3>
              <p style={{ color: "#e0e0e0", minHeight: "40px" }}>
                {cat.description || "No description available"}
              </p>
              {admin && (
                <div style={{ marginTop: "15px" }}>
                  <button
                    style={editBtn}
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/categories/edit/${cat.id}`);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={delBtn}
                    onClick={e => handleDelete(e, cat.id, cat.name)}
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            fontWeight: "bolder",
            color: "#ffeced",
            background: "#ec646c",
            fontStyle: "italic",
            borderRadius: 12,
            padding: "17px 0",
            marginTop: 30,
            fontSize: 17,
            boxShadow: "0 2px 8px #c6262611"
          }}
        >
          {searchTerm.trim() ? `No categories found for "${searchTerm}".` : "No categories found."}
        </p>
      )}
    </div>
  );
}

export default CategoriesList;