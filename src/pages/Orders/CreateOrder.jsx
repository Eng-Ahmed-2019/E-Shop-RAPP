import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createOrder } from "../../services/ordersApi";
import productsApi from "../../services/productsApi";

function CreateOrder() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0, basePrice: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [namesByIndex, setNamesByIndex] = useState({});

  // Prefill from query params
  useEffect(() => {
    const qpProductId = search.get("productId");
    const qpPrice = Number(search.get("price") || 0);
    if (qpProductId) {
      setItems([{ productId: qpProductId, quantity: 1, price: qpPrice, basePrice: qpPrice }]);
    }
  }, [search]);

  // Resolve product names for current items
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const map = {};
      for (let i = 0; i < items.length; i++) {
        const pid = Number(items[i].productId);
        if (!pid || Number.isNaN(pid)) continue;
        try {
          const res = await productsApi.get(`/Products/${pid}`);
          map[i] = res.data?.name || `#${pid}`;
        } catch (_) {
          map[i] = `#${pid}`;
        }
      }
      if (!cancelled) setNamesByIndex(map);
    };
    load();
    return () => { cancelled = true; };
  }, [items]);

  const updateItem = (idx, field, value) => {
    const next = items.map((it, i) => {
      if (i !== idx) return it;
      let updated = { ...it, [field]: value };
      if (field === "quantity") {
        const q = Number(value);
        updated.price = it.basePrice * q;
      }
      return updated;
    });
    setItems(next);
  };

  const resetItem = (idx) => {
    const next = items.map((it, i) =>
      i === idx ? { ...it, quantity: 0, price: 0 } : it
    );
    setItems(next);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      items: items
        .filter((it) => it.productId && Number(it.quantity) > 0)
        .map((it) => ({
          productId: Number(it.productId),
          quantity: Number(it.quantity),
          price: Number(it.price),
        })),
    };

    if (!payload.items.length) {
      setError("Add at least one valid item");
      return;
    }

    try {
      setSubmitting(true);
      const created = await createOrder(payload);
      navigate(`/orders/${created.id || created.Id}`);
    } catch (e) {
      setError(e?.response?.data || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  // 🎨 تنسيقات الصفحة الاحترافية
  const pageStyle = {
    maxWidth: "900px",
    margin: "60px auto",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    fontFamily: "'Segoe UI', sans-serif",
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
    marginRight: "16px",
    transition: "0.3s",
  };

  const hoverBackBtn = (e, hover) => {
    e.target.style.transform = hover ? "scale(1.05)" : "scale(1)";
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "10px",
    border: "1.5px solid #bdbdfa",
    outline: "none",
    fontSize: "15px",
    width: "100%",
    background: "rgba(42,37,70,0.87)", // خلفية بنفسجي غامق واضحة
    color: "#f7f7ff",
    marginTop: "3px",
    marginBottom: "3px",
    boxShadow: "0 2px 12px 0 rgba(106,90,249,0.06)",
    transition: "border .3s, background .3s",
  };
  const labelStyle = {
    fontWeight: 600,
    fontSize: '15.3px',
    marginBottom: '3px',
    background: 'linear-gradient(92deg, #a084ff, #6a5af9, #8740ff 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 10px rgba(106,90,249,0.13)',
    letterSpacing: '.7px',
    textTransform: 'capitalize',
    paddingLeft: '1.5px',
  };

  const buttonStyle = {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    background: "linear-gradient(90deg, #2196F3, #0b79d0)",
    color: "#fff",
    transition: "0.3s",
  };

  const hoverButton = (e, hover) => {
    e.target.style.background = hover
      ? "linear-gradient(90deg, #0b79d0, #0a6cb8)"
      : "linear-gradient(90deg, #2196F3, #0b79d0)";
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <button
          onClick={() => navigate(-1)}
          style={backBtnStyle}
          onMouseEnter={(e) => hoverBackBtn(e, true)}
          onMouseLeave={(e) => hoverBackBtn(e, false)}
        >
          ⬅ Back
        </button>
        <h2 style={{ margin: 0, fontWeight: "bold" }}>🛒 Create New Order</h2>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(255, 0, 0, 0.2)",
            padding: "10px 15px",
            borderRadius: "10px",
            marginBottom: "20px",
            color: "#b91c1c",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        {items.map((it, idx) => (
          <div key={idx} style={cardStyle}>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: "1.2", display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Product</label>
                <input
                  value={namesByIndex[idx] || `#${it.productId}`}
                  readOnly
                  title={`ID: ${it.productId}`}
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Total Price</label>
                <input
                  value={it.price}
                  readOnly
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <label style={{ color: "transparent" }}>-</label>
                <button
                  type="button"
                  onClick={() => resetItem(idx)}
                  title="Reset this item"
                  style={{ ...buttonStyle, background: "#ef4444" }}
                  onMouseEnter={(e) => hoverButton(e, true)}
                  onMouseLeave={(e) => hoverButton(e, false)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          style={{ ...buttonStyle, width: "100%", marginTop: "20px" }}
          onMouseEnter={(e) => hoverButton(e, true)}
          onMouseLeave={(e) => hoverButton(e, false)}
        >
          {submitting ? "Creating..." : "✅ Create Order"}
        </button>
      </form>
    </div>
  );
}

export default CreateOrder;