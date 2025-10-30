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
    return (
      <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        ⏳ Loading category...
      </p>
    );
  }

  // 🎨 التنسيقات الاحترافية داخل الصفحة
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif",
    color: "#fff",
  };

  const backBtnStyle = {
    marginBottom: "25px",
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#fff",
    color: "#333",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "0.3s",
  };

  const hoverBackBtn = (e, hover) => {
    e.target.style.transform = hover ? "scale(1.05)" : "scale(1)";
  };

  const formCardStyle = {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: "15px",
    marginTop: "5px",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(90deg, #2196F3, #0b79d0)",
    marginTop: "15px",
    transition: "0.3s",
  };

  const hoverButton = (e, hover) => {
    e.target.style.background = hover
      ? "linear-gradient(90deg, #0b79d0, #0a6cb8)"
      : "linear-gradient(90deg, #2196F3, #0b79d0)";
  };

  return (
    <div style={pageStyle}>
      <button
        onClick={() => navigate(-1)}
        style={backBtnStyle}
        onMouseEnter={(e) => hoverBackBtn(e, true)}
        onMouseLeave={(e) => hoverBackBtn(e, false)}
      >
        ← Back
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: "bold" }}>
        ✏️ Edit Category
      </h2>

      <form style={formCardStyle} onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label>Name:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={textareaStyle}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={buttonStyle}
          onMouseEnter={(e) => hoverButton(e, true)}
          onMouseLeave={(e) => hoverButton(e, false)}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default EditCategory;