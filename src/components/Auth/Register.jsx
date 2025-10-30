import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/Auth/register", formData);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data || "Registration failed");
    }
  };

  // ===================== STYLES =====================
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #5a60ff, #7e3ff2)",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "45px 35px",
    width: "100%",
    maxWidth: "420px",
    color: "#fff",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    margin: "12px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255, 255, 255, 0.25)",
    color: "#fff",
    fontSize: "15px",
    transition: "background 0.3s, box-shadow 0.3s",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    marginTop: "20px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #6a5af9, #8740ff)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
    boxShadow: "0 4px 10px rgba(134, 67, 255, 0.4)",
  };

  const inputFocus = (e, focus) => {
    e.target.style.background = focus
      ? "rgba(255, 255, 255, 0.35)"
      : "rgba(255, 255, 255, 0.25)";
    e.target.style.boxShadow = focus
      ? "0 0 10px rgba(255,255,255,0.5)"
      : "none";
  };

  const buttonHover = (e, hover) => {
    e.target.style.background = hover
      ? "linear-gradient(90deg, #5a50f5, #7339f5)"
      : "linear-gradient(90deg, #6a5af9, #8740ff)";
    e.target.style.transform = hover ? "translateY(-2px)" : "translateY(0)";
    e.target.style.boxShadow = hover
      ? "0 6px 14px rgba(134, 67, 255, 0.6)"
      : "0 4px 10px rgba(134, 67, 255, 0.4)";
  };

  return (
    <div style={containerStyle}>
      <div
        style={cardStyle}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <h2
          style={{
            marginBottom: "25px",
            fontSize: "30px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          Create Your Account ✨
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => inputFocus(e, true)}
            onBlur={(e) => inputFocus(e, false)}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => inputFocus(e, true)}
            onBlur={(e) => inputFocus(e, false)}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => inputFocus(e, true)}
            onBlur={(e) => inputFocus(e, false)}
          />
          <select
            name="role"
            onChange={handleChange}
            style={selectStyle}
            value={formData.role}
            onFocus={(e) => inputFocus(e, true)}
            onBlur={(e) => inputFocus(e, false)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => buttonHover(e, true)}
            onMouseLeave={(e) => buttonHover(e, false)}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: "25px", fontSize: "14px", opacity: 0.9 }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#cfc7ff",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;