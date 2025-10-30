import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders, deleteOrder, updateOrderStatus } from "../../services/ordersApi";
import { isAdmin } from "../../services/authService";

function OrdersList() {
  const formatOrderDate = (value) => {
    if (!value) return "-";
    const str = String(value);
    const hasTz = /Z|[+-]\d{2}:?\d{2}$/.test(str);
    const dt = new Date(hasTz ? str : `${str}Z`);
    if (isNaN(dt.getTime())) return str;
    return dt.toLocaleString();
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const admin = isAdmin();
  const [statusEdits, setStatusEdits] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setError("");
    } catch (e) {
      setError(e?.response?.data || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      await load();
    } catch (e) {
      alert(e?.response?.data || "Failed to delete");
    }
  };

  const handleStatusChange = (id, value) => {
    setStatusEdits((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatusSave = async (id) => {
    const newStatus = statusEdits[id];
    if (!newStatus) return;
    try {
      await updateOrderStatus(id, newStatus);
      await load();
    } catch (e) {
      alert(e?.response?.data || "Failed to update status");
    }
  };

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

  const cardStyle = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px",
    width: "90%",
    maxWidth: 950,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    color: "#fff",
  };

  const actionBtnStyle = (bg) => ({
    padding: "6px 14px",
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "600",
    transition: "0.2s",
  });

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
        <h2 style={{ marginBottom: 20, fontWeight: "bold" }}>Orders List</h2>

        {orders.length === 0 ? (
          <p style={{ color: "#f3f4f6", textAlign: "center", fontStyle: "italic" }}>No orders found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: 12, overflow: "hidden" }}>
            <thead style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
              <tr>
                <th style={{ textAlign: "left", padding: 12 }}>Id</th>
                <th style={{ textAlign: "left", padding: 12 }}>Date</th>
                <th style={{ textAlign: "left", padding: 12 }}>Status</th>
                <th style={{ textAlign: "center", padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr
                  key={o.id}
                  style={{
                    background: idx % 2 === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <td style={{ padding: 12 }}>{o.id}</td>
                  <td style={{ padding: 12 }}>{formatOrderDate(o.orderDate || o.OrderDate)}</td>
                  <td style={{ padding: 12 }}>
                    {admin ? (
                      <select
                        value={statusEdits[o.id] ?? o.status ?? o.Status ?? "Pending"}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{ padding: 6, borderRadius: 6, border: "none", outline: "none" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        style={{
                          fontWeight: 600,
                          color: (o.status || o.Status || "").toLowerCase() === "completed" ? "#34d399" : "#fbbf24",
                        }}
                      >
                        {o.status || o.Status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: 12, display: "flex", justifyContent: "center", gap: "10px" }}>
                    {!admin ? (
                      ((o.status || o.Status || "").toLowerCase() !== "pending") ? (
                        <span style={{ color: "#ccc", fontStyle: "italic" }}>No Actions</span>
                      ) : (
                        <>
                          <button onClick={() => navigate(`/orders/${o.id}`)} style={actionBtnStyle("#3b82f6")}>
                            Details
                          </button>
                          <button onClick={() => handleDelete(o.id)} style={actionBtnStyle("#ef4444")}>
                            Delete
                          </button>
                        </>
                      )
                    ) : (o.status || o.Status || "").toLowerCase() === "completed" ? (
                      <span style={{ color: "#ccc", fontStyle: "italic" }}>No Actions</span>
                    ) : (
                      <button onClick={() => handleStatusSave(o.id)} style={actionBtnStyle("#10b981")}>
                        Save
                      </button>
                    )}
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

export default OrdersList;