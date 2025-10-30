import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders, deleteOrder, updateOrderStatus } from "../../services/ordersApi";
import { isAdmin } from "../../services/authService";

function OrdersList() {
  // 📅 always show local time: UTC from backend will show local, plain string will show as is
  const formatOrderDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  // اليوم/الشهر/السنة - الساعة:دقيقة AM/PM بتوقيت جهاز المستخدم
  return date.toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  }).replace(",", " -");
};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const admin = isAdmin();
  const [statusEdits, setStatusEdits] = useState({});

  // ترتيب الحالات
  const statusOrder = ["Pending", "Processing", "Completed"];

  // helper لإرجاع الخيارات المتاحة
  function getNextStatusOptions(currentStatus) {
    const lowerCurrent = (currentStatus || "Pending").toLowerCase();
    // index
    const idx = statusOrder.findIndex(
      (s) => s.toLowerCase() === lowerCurrent
    );
    let options = [];
    if (idx >= 0) {
      // فقط الحالات القادمة
      options = statusOrder.slice(idx + 1);
    }
    if (!options.includes("Cancelled") && lowerCurrent !== "completed") {
      options.push("Cancelled");
    }
    return options;
  }

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

  // حفظ الحالة مع feedback صغير
  const saveStatus = async (id, newStatus, auto = false) => {
    if (!newStatus) return;
    try {
      await updateOrderStatus(id, newStatus);
      await load();
    } catch (e) {
      // نفس الشيء، بدون feedback
    }
  };

  // عند تغيير الـ select
  const handleStatusChange = (id, value) => {
    setStatusEdits((prev) => {
      const newEdits = { ...prev, [id]: value };
      // حفظ تلقائي إذا كانت الحالة مختارة هي Completed أو Cancelled
      if (value === "Completed" || value === "Cancelled") {
        setTimeout(() => {
          saveStatus(id, value, true);
        }, 0);
      }
      return newEdits;
    });
  };

  // عند الضغط على زر الحفظ
  const handleStatusSaveBtn = (id) => {
    const newStatus = statusEdits[id];
    if (!newStatus) return;
    saveStatus(id, newStatus);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      await load();
    } catch (e) {
      alert(e?.response?.data || "Failed to delete");
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
              {orders.map((o, idx) => {
                const curr = o.status ?? o.Status ?? "Pending";
                const selectVal = statusEdits[o.id] ?? curr;
                const isDone = ["Completed", "Cancelled"].includes(selectVal) || ["completed", "cancelled"].includes((curr || "").toLowerCase());
                const nextOptions = getNextStatusOptions(curr);
                return (
                  <tr
                    key={o.id}
                    style={{
                      background: idx % 2 === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                      borderBottom: "1px solid rgba(255,255,255,0.2)"
                    }}>
                    <td style={{ padding: 12 }}>{o.id}</td>
                    <td style={{ padding: 12 }}>{formatOrderDate(o.orderDate || o.OrderDate || "-")}</td>
                    <td style={{ padding: 12 }}>
                      {admin ? (
                        isDone ? (
                          <span style={{ color: selectVal === "Cancelled" ? '#ef4444' : '#34d399', fontWeight: 700, fontStyle: 'italic' }}>{selectVal}</span>
                        ) : (
                          <select
                            value={selectVal}
                            onChange={e => handleStatusChange(o.id, e.target.value)}
                            style={{ padding: 6, borderRadius: 6, border: "none", outline: "none" }}
                          >
                            <option value={curr} disabled>{curr}</option>
                            {nextOptions.map((opt) => (
                              <option value={opt} key={opt}>{opt}</option>
                            ))}
                          </select>
                        )
                      ) : (
                        <span style={{ fontWeight: 600, color: (o.status || o.Status || "").toLowerCase() === "completed" ? "#34d399" : "#fbbf24" }}>
                          {o.status || o.Status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: 12, display: "flex", justifyContent: "center", gap: "10px" }}>
                      {(() => {
                        if (!admin) {
                          // المستخدم العادي لو الحالة ليست Pending، يظهر فقط no actions
                          if (["Completed","Cancelled","Processing"].includes(curr) || ["completed","cancelled","processing"].includes((curr || "").toLowerCase())) {
                            return <span style={{ color: "#b0b4be", fontStyle: "italic" }}>No Actions Available</span>;
                          }
                          // الحالة Pending، تظهر أكشنز المستخدم
                          return (
                            <>
                              <button onClick={() => navigate(`/orders/${o.id}`)} style={{ padding: "6px 14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "0.2s" }}>Details</button>
                              <button onClick={() => handleDelete(o.id)} style={{ padding: "6px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "0.2s" }}>Delete</button>
                            </>
                          );
                        }
                        // الأدمن: الأكشنز كما هي (Save يظهر لو ينطبق الشرط عند الأدمن فقط)
                        const selectVal = statusEdits[o.id] ?? curr;
                        const isDone = ["Completed", "Cancelled"].includes(selectVal) || ["completed", "cancelled"].includes((curr || "").toLowerCase());
                        if (isDone) {
                          return <span style={{ color: "#b0b4be", fontStyle: "italic" }}>No Actions Available</span>;
                        }
                        return <button onClick={() => handleStatusSaveBtn(o.id)} style={{ padding: "6px 14px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "0.2s" }}>Save</button>;
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrdersList;