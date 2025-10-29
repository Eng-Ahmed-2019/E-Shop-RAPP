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
      <div style={{ padding: 20, fontSize: 18, textAlign: "center" }}>
        Loading...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          padding: 20,
          color: "white",
          backgroundColor: "#dc3545",
          borderRadius: 8,
          margin: 20,
          textAlign: "center",
        }}
      >
        {error}
      </div>
    );

  if (!order) return null;

  const items = order.items || order.Items || [];
  const user = order.user || order.User || null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 40,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          width: "90%",
          maxWidth: 800,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "24px 32px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 20,
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ← Back
        </button>

        <h2 style={{ marginBottom: 10, color: "#333" }}>
          Order #{order.id || order.Id}
        </h2>
        <p style={{ margin: "6px 0" }}>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color:
                (order.status || order.Status)?.toLowerCase() === "completed"
                  ? "green"
                  : "#555",
              fontWeight: "600",
            }}
          >
            {order.status || order.Status}
          </span>
        </p>
        <p style={{ margin: "6px 0" }}>
          <strong>Date:</strong>{" "}
          {formatOrderDate(order.orderDate || order.OrderDate)}
        </p>

        {user && (
          <div
            style={{
              background: "#f9fafc",
              padding: 12,
              borderRadius: 8,
              marginTop: 16,
              marginBottom: 24,
              border: "1px solid #eee",
            }}
          >
            <h4 style={{ marginBottom: 8, color: "#444" }}>User Info</h4>
            <div style={{ marginBottom: 4 }}>
              <strong>Username:</strong> {user.userName || user.UserName}
            </div>
            <div>
              <strong>Email:</strong> {user.email || user.Email}
            </div>
          </div>
        )}

        <h3 style={{ marginBottom: 10, color: "#333" }}>Items</h3>
        {items.length === 0 ? (
          <p style={{ color: "#777" }}>No items.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#007bff", color: "white" }}>
              <tr>
                <th style={{ textAlign: "left", padding: 10 }}>Product Name</th>
                <th style={{ textAlign: "left", padding: 10 }}>Qty</th>
                <th style={{ textAlign: "left", padding: 10 }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#f9f9f9" : "white",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: 10 }}>
                    {it.productName || it.ProductName || "-"}
                  </td>
                  <td style={{ padding: 10 }}>
                    {it.quantity || it.Quantity}
                  </td>
                  <td style={{ padding: 10 }}>
                    ${it.price || it.Price}
                  </td>
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