import React, { useState } from "react";
import categoriesApi from "../../services/categoriesApi";
import { useNavigate } from "react-router-dom";

function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await categoriesApi.post("/categories", {
        name,
        description,
      });

      if (response.status === 201 || response.status === 200) {
        setMessage("✅ Category added successfully!");
        setTimeout(() => navigate("/categories"), 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 التنسيقات الداخلية الاحترافية
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #141e30, #243b55)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    padding: "40px",
    width: "100%",
    maxWidth: "480px",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "26px",
    fontWeight: "600",
  };

  const inputGroup = {
    marginBottom: "18px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "15px",
    color: "#e0e0e0",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "15px",
    transition: "0.3s",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #4CAF50, #2e8b57)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    marginTop: "10px",
  };

  const backButtonStyle = {
    alignSelf: "flex-start",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "25px",
    fontWeight: "bold",
    transition: "0.3s",
  };

  const messageStyle = {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "15px",
    color: message.includes("✅") ? "#4CAF50" : "#ff4d4f",
    fontWeight: "500",
  };

  // تأثير hover للأزرار
  const hoverEffect = (e, hover) => {
    e.target.style.background = hover
      ? "linear-gradient(90deg, #3e8e41, #1e6931)"
      : "linear-gradient(90deg, #4CAF50, #2e8b57)";
  };

  const hoverBack = (e, hover) => {
    e.target.style.background = hover
      ? "rgba(255,255,255,0.35)"
      : "rgba(255,255,255,0.2)";
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate(-1)}
        style={backButtonStyle}
        onMouseEnter={(e) => hoverBack(e, true)}
        onMouseLeave={(e) => hoverBack(e, false)}
      >
        ← Back
      </button>

      <div style={cardStyle}>
        <h2 style={titleStyle}>🆕 Add New Category</h2>

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>Category Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              style={{ ...inputStyle, resize: "none" }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            onMouseEnter={(e) => hoverEffect(e, true)}
            onMouseLeave={(e) => hoverEffect(e, false)}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>

          {message && <p style={messageStyle}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddCategory;