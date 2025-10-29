import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn, userName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // تحديث حالة تسجيل الدخول فورًا
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
      }}
    >
      {/* ✅ الجزء الأيسر من النافبار */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Home
        </h2>
        {isLoggedIn && (
          <>
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/categories")}
            >
              Categories
            </h2>
            <h2
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/products")}
            >
              Products
            </h2>
          </>
        )}
        {isLoggedIn && (
          <h2
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/orders")}
          >
            Orders
          </h2>
        )}
      </div>

      {/* ✅ الجزء الأيمن من النافبار */}
      <div>
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                marginRight: "10px",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "6px 12px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#fff",
                color: "#007bff",
              }}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span style={{ marginRight: "15px" }}>Hello, {userName}</span>
            <button
              onClick={() => navigate("/profile")}
              style={{
                marginRight: "10px",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#fff",
                color: "#007bff",
              }}
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#ff4d4f",
                color: "#fff",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;