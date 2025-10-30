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
        background:
          "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
        color: "#fff",
        textAlign: "center",
        fontFamily: "Segoe UI, sans-serif",
        padding: "0 20px",
      }}
    >
      <h1
        style={{
          fontSize: "3.2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          textShadow: "0 4px 10px rgba(0,0,0,0.3)",
          letterSpacing: 0.5,
        }}
      >
        🛍️ Welcome to E-Shop
      </h1>

      {isLoggedIn ? (
        <p
          style={{
            fontSize: "1.3rem",
            marginBottom: "2rem",
            opacity: 0.9,
            fontWeight: 500,
          }}
        >
          Hello, <span style={{ fontWeight: "bold" }}>{userName}</span> 👋  
          <br />
          Ready to explore our latest products?
        </p>
      ) : (
        <p
          style={{
            fontSize: "1.3rem",
            marginBottom: "2rem",
            maxWidth: 600,
            opacity: 0.9,
            lineHeight: 1.6,
          }}
        >
          Discover the best deals and newest trends all in one place — your
          favorite online shopping destination!
        </p>
      )}

      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "#fff",
                color: "#2563eb",
                border: "none",
                padding: "12px 26px",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(255,255,255,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🔑 Login
            </button>

            <button
              onClick={() => navigate("/register")}
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "12px 26px",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1e40af";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              📝 Register
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/profile")}
            style={{
              backgroundColor: "#fff",
              color: "#2563eb",
              border: "none",
              padding: "12px 26px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 10px rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            👤 Go to Profile
          </button>
        )}
      </div>

      <footer
        style={{
          position: "absolute",
          bottom: "30px",
          fontSize: "0.9rem",
          opacity: 0.8,
          letterSpacing: 0.3,
        }}
      >
        © {new Date().getFullYear()} E-Shop. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;