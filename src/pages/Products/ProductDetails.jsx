import React, { useEffect, useState } from "react";
import productsApi from "../../services/productsApi";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsApi.get(`/Products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("❌ Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: "center", marginTop: 50, color: "red", fontWeight: "bold" }}>{error}</p>;
  if (!product)
    return <p style={{ textAlign: "center", marginTop: 50, color: "#000", fontWeight: "bold" }}>Product not found.</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: 40,
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 20,
          padding: 30,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          color: "#fff",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 20,
            padding: "10px 20px",
            border: "none",
            backgroundColor: "rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s",
          }}
        >
          ← Back
        </button>

        <h2 style={{ marginBottom: 20, fontWeight: "bold" }}>{product.name}</h2>

        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: "bold", fontSize: 20, color: "#28a745" }}>
            ${product.price?.toFixed ? product.price.toFixed(2) : Number(product.price || 0).toFixed(2)}
          </span>
          <span style={{ color: "#fff", opacity: 0.8 }}>Stock: {product.stock ?? product.quantity ?? 0}</span>
        </div>

        {product.imageUrl && (
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 15,
                boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
              }}
            />
          </div>
        )}

        <p style={{ color: "#fff", opacity: 0.9, marginBottom: 20 }}>
          {product.description || "No description available"}
        </p>

        {product.categoryName && (
          <div
            style={{
              padding: 15,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              marginBottom: 20,
              fontWeight: "bold",
            }}
          >
            Category: {product.categoryName}
          </div>
        )}

        <button
          onClick={() =>
            navigate(`/orders/create?productId=${product.id || product.productId || id}&price=${product.price}`)
          }
          style={{
            padding: "12px 20px",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s",
            width: "100%",
            fontSize: 16,
          }}
        >
          Order this product
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;