import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders, deleteOrder, updateOrderStatus } from "../../services/ordersApi";
import { isAdmin } from "../../services/authService";

function OrdersList() {
  const formatOrderDate = (value) => {
    if (!value) return "-";
    const str = String(value);
    // If the string has no timezone, assume UTC (backend likely used DateTime.UtcNow)
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
          maxWidth: 900,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "24px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ color: "#333", margin: 0 }}>Orders</h2>
        </div>

        {orders.length === 0 ? (
          <p style={{ color: "#777", textAlign: "center" }}>No orders found.</p>
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
                <th style={{ textAlign: "left", padding: 10 }}>Id</th>
                <th style={{ textAlign: "left", padding: 10 }}>Date</th>
                <th style={{ textAlign: "left", padding: 10 }}>Status</th>
                <th style={{ textAlign: "center", padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr
                  key={o.id}
                  style={{
                    background: idx % 2 === 0 ? "#f9f9f9" : "white",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: 10 }}>{o.id}</td>
                  <td style={{ padding: 10 }}>
                    {formatOrderDate(o.orderDate || o.OrderDate)}
                  </td>
                  <td style={{ padding: 10 }}>
                    {admin ? (
                      <select
                        value={statusEdits[o.id] ?? o.status ?? o.Status ?? "Pending"}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{ padding: 6 }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span style={{ fontWeight: 600, color: (o.status || o.Status || "").toLowerCase() === "completed" ? "green" : "#555" }}>
                        {o.status || o.Status}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: 10,
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {!admin ? (
                      ((o.status || o.Status || "").toLowerCase() !== "pending") ? (
                        <span style={{ color: "#999", fontStyle: "italic" }}>No Actions Available</span>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(`/orders/${o.id}`)}
                            style={{
                              padding: "6px 12px",
                              background: "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: 5,
                              cursor: "pointer",
                              fontSize: 13,
                            }}
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleDelete(o.id)}
                            style={{
                              padding: "6px 12px",
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: 5,
                              cursor: "pointer",
                              fontSize: 13,
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )
                    ) : (
                      (o.status || o.Status || "").toLowerCase() === "completed" ? (
                        <span style={{ color: "#999", fontStyle: "italic" }}>No Actions Available</span>
                      ) : (
                        <button
                          onClick={() => handleStatusSave(o.id)}
                          style={{
                            padding: "6px 12px",
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: 5,
                            cursor: "pointer",
                            fontSize: 13,
                          }}
                        >
                          Save
                        </button>
                      )
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