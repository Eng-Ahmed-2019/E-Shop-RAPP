import React, { useState, useEffect } from "react";
import productsApi from "../../services/productsApi";
import categoriesApi from "../../services/categoriesApi";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          productsApi.get(`/Products/${id}`),
          categoriesApi.get("/categories")
        ]);
        setForm({
          name: productRes.data.name,
          description: productRes.data.description || "",
          price: productRes.data.price,
          stock: productRes.data.stock,
          imageUrl: productRes.data.imageUrl || "",
          categoryId: productRes.data.categoryId
        });
        setCategories(categoriesRes.data);
      } catch (err) {
        setMessage("❌ Failed to load product details or categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndCategories();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
  const response = await productsApi.put(`/Products/${id}`, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      });
      if (response.status === 204 || response.status === 200) {
        setMessage("✅ Product updated successfully!");
        setTimeout(() => navigate("/products"), 1500);
      }
    } catch (error) {
      setMessage("❌ Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading...</p>;

  return (
    <div style={{ padding: 40, background: "#f5f6fa", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20, padding: "8px 16px", border: "none", backgroundColor: "#fff", color: "#333", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>← Back</button>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>✏️ Edit Product</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "0 auto", background: "#fff", padding: 30, borderRadius: 15, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: 15 }}>
          <label>Name:</label>
          <input name="name" type="text" required value={form.name} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", marginTop: 5 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Description:</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", marginTop: 5 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Price:</label>
          <input name="price" type="number" step="0.01" required value={form.price} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", marginTop: 5 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Stock:</label>
          <input name="stock" type="number" required value={form.stock} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", marginTop: 5 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Image URL:</label>
          <input name="imageUrl" type="text" value={form.imageUrl} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", marginTop: 5 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Category:</label>
          <select
            name="categoryId"
            required
            value={form.categoryId}
            onChange={handleChange}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", marginTop: 5 }}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={saving} style={{ width: "100%", padding: 12, border: "none", borderRadius: 8, backgroundColor: "#2196F3", color: "#fff", fontSize: 16, fontWeight: "bold", cursor: "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button>
        {message && <p style={{ marginTop: 20, textAlign: "center" }}>{message}</p>}
      </form>
    </div>
  );
}

export default EditProduct;
