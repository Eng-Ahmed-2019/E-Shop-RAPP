import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Profile({ setIsLoggedIn, setUserName }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setUserName(decoded.email || "User"); // تحديث اسم المستخدم على مستوى App.jsx
      setIsLoggedIn(true); // تحديث حالة تسجيل الدخول على مستوى App.jsx
    } catch (err) {
      localStorage.clear();
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [navigate, setIsLoggedIn, setUserName]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
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

  const infoStyle = {
    margin: "10px 0",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
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
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "25px" }}>
          Profile Page
        </h2>

        {user ? (
          <div>
            <p style={infoStyle}><strong>Email:</strong> {user.email}</p>
            <p style={infoStyle}><strong>User ID:</strong> {user.sub}</p>

            <button
              onClick={handleLogout}
              style={buttonStyle}
              onMouseEnter={(e) => buttonHover(e, true)}
              onMouseLeave={(e) => buttonHover(e, false)}
            >
              Logout
            </button>
          </div>
        ) : (
          <p style={{ fontSize: "16px", marginTop: "20px" }}>Loading user...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;