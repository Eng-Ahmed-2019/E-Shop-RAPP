import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login({ setIsLoggedIn, setUserName }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/Auth/login", formData);
      const { accessToken, refreshToken } = response.data;

      // حفظ التوكن في localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // تحديث حالة تسجيل الدخول واسم المستخدم على مستوى App.jsx
      const decoded = jwtDecode(accessToken);
      setIsLoggedIn(true);
      setUserName(decoded.email || "User");

      navigate("/profile");
    } catch (error) {
      alert(error.response?.data || "Login failed");
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Segoe UI, sans-serif",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    color: "#fff",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    fontSize: "15px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  };

  const buttonHover = (e, hover) => {
    e.target.style.background = hover
      ? "linear-gradient(90deg, #5a67d8, #6b46c1)"
      : "linear-gradient(90deg, #667eea, #764ba2)";
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "25px", fontSize: "28px", fontWeight: "bold" }}>
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => buttonHover(e, true)}
            onMouseLeave={(e) => buttonHover(e, false)}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <a
            href="/register"
            style={{ color: "#c3bffb", textDecoration: "underline" }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;