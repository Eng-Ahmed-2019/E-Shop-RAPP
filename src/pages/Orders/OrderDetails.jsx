import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderById } from "../../services/ordersApi";

function OrderDetails() {
  const formatOrderDate = (value) => {
    if (!value) return "-";
    const str = String(value);
    const hasTz = /Z|[+-]\d{2}:?\d{2}$/.test(str);
    const dt = new Date(hasTz ? str : `${str}Z`);
    if (isNaN(dt.getTime())) return str;
    return dt.toLocaleString();
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderById(id);
        setOrder(data);
        setError("");
      } catch (e) {
        setError(e?.response?.data || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: 40, fontSize: 18, textAlign: "center", color: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>
        Loading...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          padding: 20,
          color: "#fff",
          backgroundColor: "#ef4444",
          borderRadius: 12,
          margin: 20,
          textAlign: "center",
          fontWeight: "bold",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        {error}
      </div>
    );

  if (!order) return null;

  const items = order.items || order.Items || [];
  const user = order.user || order.User || null;

  const cardStyle = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px",
    width: "90%",
    maxWidth: 850,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    color: "#fff",
  };

  const backBtnStyle = {
    background: "#fff",
    color: "#333",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    marginBottom: "20px",
    transition: "0.3s",
  };

  const hoverBackBtn = (e, hover) => {
    e.target.style.transform = hover ? "scale(1.05)" : "scale(1)";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 50,
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div style={cardStyle}>
        <button
          onClick={() => navigate(-1)}
          style={backBtnStyle}
          onMouseEnter={(e) => hoverBackBtn(e, true)}
          onMouseLeave={(e) => hoverBackBtn(e, false)}
        >
          ← Back
        </button>

        <h2 style={{ marginBottom: 10, fontWeight: "bold" }}>Order #{order.id || order.Id}</h2>
        <p style={{ margin: "6px 0" }}>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color: (order.status || order.Status)?.toLowerCase() === "completed" ? "#34d399" : "#facc15",
              fontWeight: "600",
            }}
          >
            {order.status || order.Status}
          </span>
        </p>
        <p style={{ margin: "6px 0" }}>
          <strong>Date:</strong> {formatOrderDate(order.orderDate || order.OrderDate)}
        </p>

        {user && (
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: 16,
              borderRadius: 12,
              marginTop: 20,
              marginBottom: 25,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <h4 style={{ marginBottom: 8, fontWeight: "600" }}>User Info</h4>
            <div style={{ marginBottom: 4 }}>
              <strong>Username:</strong> {user.userName || user.UserName}
            </div>
            <div>
              <strong>Email:</strong> {user.email || user.Email}
            </div>
          </div>
        )}

        <h3 style={{ marginBottom: 15, fontWeight: "600" }}>Items</h3>
        {items.length === 0 ? (
          <p style={{ color: "#f3f4f6", fontStyle: "italic" }}>No items.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: 12, overflow: "hidden" }}>
            <thead style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
              <tr>
                <th style={{ textAlign: "left", padding: 12 }}>Product Name</th>
                <th style={{ textAlign: "left", padding: 12 }}>Qty</th>
                <th style={{ textAlign: "left", padding: 12 }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <td style={{ padding: 12 }}>{it.productName || it.ProductName || "-"}</td>
                  <td style={{ padding: 12 }}>{it.quantity || it.Quantity}</td>
                  <td style={{ padding: 12 }}>${it.price || it.Price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;