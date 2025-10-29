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
    return () => {
      cancelled = true;
    };
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

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "60px auto",
        background: "linear-gradient(135deg, #f9fafb, #eef1f4)",
        borderRadius: "14px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        padding: "40px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            marginRight: "16px",
          }}
        >
          ⬅ Back
        </button>
        <h2 style={{ color: "#1f2937", margin: 0 }}>🛒 Create New Order</h2>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            padding: "10px 15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        {items.map((it, idx) => (
          <div
            key={idx}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Product Name (instead of ID) */}
              <div style={{ display: "flex", flexDirection: "column", flex: "1.2" }}>
                <label style={{ fontSize: "14px", color: "#374151", marginBottom: "6px" }}>
                  Product
                </label>
                <input
                  value={namesByIndex[idx] || `#${it.productId}`}
                  readOnly
                  title={`ID: ${it.productId}`}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f3f4f6",
                    cursor: "not-allowed",
                    color: "#374151",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Quantity */}
              <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
                <label style={{ fontSize: "14px", color: "#374151", marginBottom: "6px" }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Total Price */}
              <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
                <label style={{ fontSize: "14px", color: "#374151", marginBottom: "6px" }}>
                  Total Price
                </label>
                <input
                  value={it.price}
                  readOnly
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    cursor: "not-allowed",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Reset Button */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <label style={{ color: "transparent", marginBottom: "6px" }}>-</label>
                <button
                  type="button"
                  onClick={() => resetItem(idx)}
                  title="Reset this item"
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px" }}>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: submitting ? "#9ca3af" : "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "8px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "background 0.3s ease",
            }}
          >
            {submitting ? "Creating..." : "✅ Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrder;