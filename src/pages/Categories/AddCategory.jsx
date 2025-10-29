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

  return (
    <div
      style={{
        padding: "40px",
        background: "linear-gradient(to right, #141e30, #243b55)",
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

      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🆕 Add New Category</h2>

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
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>

        {message && (
          <p style={{ marginTop: "20px", textAlign: "center" }}>{message}</p>
        )}
      </form>
    </div>
  );
}

export default AddCategory;