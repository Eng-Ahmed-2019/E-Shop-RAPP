import React, { useState, useEffect } from "react";
import productsApi from "../../services/productsApi";
import categoriesApi from "../../services/categoriesApi";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.get("/categories");
        setCategories(res.data);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await productsApi.post("/Products", {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      });
      if (response.status === 201 || response.status === 200) {
        setMessage("✅ Product added successfully!");
        setTimeout(() => navigate("/products"), 1500);
      }
    } catch (error) {
      setMessage("❌ Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: 40,
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 550,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: 20,
          padding: 30,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          color: "#fff",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 20,
            padding: "8px 16px",
            border: "none",
            backgroundColor: "rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s",
          }}
        >
          ← Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: 30, fontWeight: "bold" }}>
          🆕 Add New Product
        </h2>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Description", name: "description", type: "textarea", rows: 3 },
            { label: "Price", name: "price", type: "number", step: "0.01" },
            { label: "Stock", name: "stock", type: "number" },
            { label: "Image URL", name: "imageUrl", type: "text" },
          ].map((field) => (
            <div style={{ marginBottom: 15 }} key={field.name}>
              <label>{field.label}:</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  rows={field.rows}
                  value={form[field.name]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 12,
                    border: "none",
                    marginTop: 5,
                    resize: "none",
                  }}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  step={field.step || undefined}
                  required
                  value={form[field.name]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 12,
                    border: "none",
                    marginTop: 5,
                  }}
                />
              )}
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <label>Category:</label>
            <select
              name="categoryId"
              required
              value={form.categoryId}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "none",
                marginTop: 5,
                background: "#fff",
                color: "#333",
              }}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 12,
              backgroundColor: "#10b981",
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.2s",
            }}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

          {message && <p style={{ marginTop: 20, textAlign: "center", fontWeight: "bold" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddProduct;