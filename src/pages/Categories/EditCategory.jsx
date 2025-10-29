import React, { useState, useEffect } from "react";
import categoriesApi from "../../services/categoriesApi";
import { useParams, useNavigate } from "react-router-dom";

function EditCategory() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🧠 تحميل بيانات الكاتيجوري عند فتح الصفحة
  useEffect(() => {
    const fetchCategory = async () => {
      try {
  const response = await categoriesApi.get(`/categories/${id}`);
        setName(response.data.name);
        setDescription(response.data.description || "");
      } catch (err) {
        setMessage("❌ Failed to load category details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // 💾 تحديث الكاتيجوري
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
  const response = await categoriesApi.put(`/categories/${id}`, {
        id,
        name,
        description,
      });

      if (response.status === 204 || response.status === 200) {
        setMessage("✅ Category updated successfully!");
        setTimeout(() => navigate("/categories"), 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d)",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          border: "none",
          backgroundColor: "#fff",
          color: "#333",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ← Back
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>✏️ Edit Category</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.1)",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              marginTop: "5px",
            }}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#2196F3",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p style={{ marginTop: "20px", textAlign: "center" }}>{message}</p>
        )}
      </form>
    </div>
  );
}

export default EditCategory;