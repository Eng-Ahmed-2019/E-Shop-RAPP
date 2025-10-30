import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn, userName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  // 🎨 التنسيقات اليدوية داخل الصفحة
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const navLeft = {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  };

  const linkStyle = {
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "500",
    color: "#6a5af9", // لون بنفسجي داكن ظاهر دائمًا
    textShadow: "0px 1px 3px rgba(134, 67, 255, 0.04)",
    padding: "5px 12px",
    borderRadius: "6px",
    transition: "all 0.3s",
    background: "linear-gradient(90deg, rgba(240,239,255,0.0) 93%, rgba(134,67,255,0.045) 100%)", // خلفية لطيفة شفافة
  };

  const linkHover = (e, hover) => {
    e.target.style.color = hover ? "#fff" : "#6a5af9";
    e.target.style.background = hover
      ? "linear-gradient(90deg, #6a5af9 30%, #8740ff 100%)"
      : "linear-gradient(90deg, rgba(240,239,255,0.0) 93%, rgba(134,67,255,0.045) 100%)";
    e.target.style.transform = hover ? "translateY(-2px) scale(1.05)" : "translateY(0) scale(1.0)";
    e.target.style.boxShadow = hover
      ? "0 3px 12px rgba(106,90,249,0.11)"
      : "none";
  };

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.3s ease",
  };

  const btnGradient = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #6a5af9, #8740ff)",
    color: "#fff",
    boxShadow: "0 4px 10px rgba(134, 67, 255, 0.4)",
  };

  const btnWhite = {
    ...buttonStyle,
    backgroundColor: "#fff",
    color: "#6a5af9",
  };

  const btnDanger = {
    ...buttonStyle,
    backgroundColor: "#ff4d4f",
    color: "#fff",
  };

  const buttonHover = (e, type, hover) => {
    if (type === "gradient") {
      e.target.style.background = hover
        ? "linear-gradient(90deg, #5a50f5, #7339f5)"
        : "linear-gradient(90deg, #6a5af9, #8740ff)";
      e.target.style.transform = hover ? "translateY(-2px)" : "translateY(0)";
      e.target.style.boxShadow = hover
        ? "0 6px 14px rgba(134, 67, 255, 0.6)"
        : "0 4px 10px rgba(134, 67, 255, 0.4)";
    } else if (type === "white") {
      e.target.style.backgroundColor = hover ? "#f0eaff" : "#fff";
    } else if (type === "danger") {
      e.target.style.backgroundColor = hover ? "#e63c3f" : "#ff4d4f";
    }
  };

  return (
    <nav style={navStyle}>
      {/* ✅ الجزء الأيسر من النافبار */}
      <div style={navLeft}>
        <h2
          style={linkStyle}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => linkHover(e, true)}
          onMouseLeave={(e) => linkHover(e, false)}
        >
          Home
        </h2>

        {isLoggedIn && (
          <>
            <h2
              style={linkStyle}
              onClick={() => navigate("/categories")}
              onMouseEnter={(e) => linkHover(e, true)}
              onMouseLeave={(e) => linkHover(e, false)}
            >
              Categories
            </h2>
            <h2
              style={linkStyle}
              onClick={() => navigate("/products")}
              onMouseEnter={(e) => linkHover(e, true)}
              onMouseLeave={(e) => linkHover(e, false)}
            >
              Products
            </h2>
            <h2
              style={linkStyle}
              onClick={() => navigate("/orders")}
              onMouseEnter={(e) => linkHover(e, true)}
              onMouseLeave={(e) => linkHover(e, false)}
            >
              Orders
            </h2>
          </>
        )}
      </div>

      {/* ✅ الجزء الأيمن من النافبار */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/login")}
              style={btnGradient}
              onMouseEnter={(e) => buttonHover(e, "gradient", true)}
              onMouseLeave={(e) => buttonHover(e, "gradient", false)}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              style={{ ...btnWhite, marginLeft: "10px" }}
              onMouseEnter={(e) => buttonHover(e, "white", true)}
              onMouseLeave={(e) => buttonHover(e, "white", false)}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span style={{ marginRight: "15px", fontSize: "15px" }}>
              Hello, <strong>{userName}</strong>
            </span>
            <button
              onClick={() => navigate("/profile")}
              style={btnWhite}
              onMouseEnter={(e) => buttonHover(e, "white", true)}
              onMouseLeave={(e) => buttonHover(e, "white", false)}
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              style={{ ...btnDanger, marginLeft: "10px" }}
              onMouseEnter={(e) => buttonHover(e, "danger", true)}
              onMouseLeave={(e) => buttonHover(e, "danger", false)}
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