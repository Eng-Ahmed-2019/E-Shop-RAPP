import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ isLoggedIn, userName }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to right, #4facfe, #00f2fe)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Welcome to E-Shop</h1>

      {isLoggedIn ? (
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Hello, {userName}!</p>
      ) : (
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
          The best place to shop your favorite products.
        </p>
      )}

      <div>
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "#fff",
                color: "#007bff",
                border: "none",
                padding: "10px 20px",
                marginRight: "10px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e6e6e6")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/profile")}
              style={{
                backgroundColor: "#fff",
                color: "#007bff",
                border: "none",
                padding: "10px 20px",
                marginRight: "10px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e6e6e6")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;