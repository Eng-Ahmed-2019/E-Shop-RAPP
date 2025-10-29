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
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  
  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!product) return <p style={{ textAlign: "center", color: "#000" }}>Product not found.</p>;

  return (
    <div style={{ padding: 40, background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginBottom: 20, 
          padding: "10px 20px", 
          border: "none", 
          backgroundColor: "#2c3e50", 
          color: "#fff", 
          borderRadius: 8, 
          cursor: "pointer", 
          fontWeight: "bold" 
        }}
      >
        ← Back
      </button>

      <div style={{ 
        maxWidth: 800, 
        margin: "0 auto", 
        background: "#fff", 
        padding: 30, 
        borderRadius: 15, 
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)" 
      }}>
        <h2 style={{ marginBottom: 20, color: "#2c3e50" }}>{product.name}</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#007bff", fontWeight: "bold", fontSize: 18 }}>
            ${product.price?.toFixed ? product.price.toFixed(2) : Number(product.price || 0).toFixed(2)}
          </span>
          <span style={{ color: "#888" }}>Stock: {product.stock ?? product.quantity ?? 0}</span>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => navigate(`/orders/create?productId=${product.id || product.productId || id}&price=${product.price}`)}
            style={{ padding: "10px 16px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            Order this product
          </button>
        </div>
        
        {product.imageUrl && (
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{ 
                maxWidth: "100%", 
                height: "auto", 
                borderRadius: 10,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }} 
            />
          </div>
        )}

        <p style={{ color: "#7f8c8d", marginBottom: 20 }}>{product.description || "No description available"}</p>

        {product.categoryName && (
          <div style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#f8f9fa",
            borderRadius: 10,
            color: "#7f8c8d"
          }}>
            <p style={{ margin: 0 }}>Category: {product.categoryName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;