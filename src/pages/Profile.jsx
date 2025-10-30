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
      setUserName(decoded.email || "User");
      setIsLoggedIn(true);
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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b21a8 100%)",
        fontFamily: "Segoe UI, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 20,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "40px 35px",
          width: "100%",
          maxWidth: 420,
          color: "#fff",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        <h2
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 25,
            letterSpacing: 0.5,
            textShadow: "0 3px 10px rgba(0,0,0,0.2)",
          }}
        >
          👤 My Profile
        </h2>

        {user ? (
          <div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "20px 10px",
                marginBottom: 20,
                boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)",
              }}
            >
              <p
                style={{
                  margin: "10px 0",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                <strong>Email:</strong> {user.email}
              </p>
              <p
                style={{
                  margin: "10px 0",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                <strong>User ID:</strong> {user.sub}
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background:
                  "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #4338ca, #6d28d9)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #4f46e5, #7c3aed)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          <p style={{ fontSize: 16, marginTop: 20, opacity: 0.8 }}>
            Loading your profile...
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;