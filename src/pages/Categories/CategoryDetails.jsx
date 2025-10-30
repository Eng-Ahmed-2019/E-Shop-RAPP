import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categoriesApi from "../../services/categoriesApi";

function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        // Fetch category details
        const categoryResponse = await categoriesApi.get(`/categories/${id}`);
        setCategory(categoryResponse.data);

        // Fetch products for this category using the categories endpoint
        const productsResponse = await categoriesApi.get(`/categories/${id}/products`);
        setProducts(productsResponse.data);
      } catch (err) {
        console.error("Error fetching category details:", err);
        const serverMsg = err.response?.data?.message || err.response?.data || err.message;
        setError(serverMsg || "No Products here yet.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div style={{ padding: "40px", background: "#f5f6fa", minHeight: "100vh" }}>
      <button
        onClick={() => navigate("/categories")}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ← Back to Categories
      </button>

      {category && (
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#333" }}>{category.name}</h2>
          <p style={{ color: "#666" }}>{category.description || "No description available"}</p>
        </div>
      )}

      <div style={{display: 'flex', alignItems: 'center', gap: 28, marginBottom: 16}}>
        <h3 style={{ color: "#333", margin: 0 }}>Products in this category:</h3>
        <input
          type="text"
          placeholder="🔎 Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            background: '#fff',
            padding: '7px 13px',
            borderRadius: 8,
            fontSize: 15,
            minWidth: 185,
            border: '1px solid #ccc',
            color: '#333',
            boxShadow: '0 2px 5px 0 #5756a014',
            outline: 'none',
          }}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredProducts.map(product => (
            <div
              key={product.id}
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <h4 style={{ color: "#333", marginBottom: "10px" }}>{product.name}</h4>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
                {product.description || "No description"}
              </p>
              <p style={{ color: "#007bff", fontWeight: "bold" }}>
                Price: ${product.price}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#d12f40",
            background: "#ffeef2",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 10,
            marginTop: 35,
            padding: "16px 0",
          }}
        >
          {searchTerm.trim() ? `No products found for "${searchTerm}".` : "No products found in this category."}
        </p>
      )}
    </div>
  );
}

export default CategoryDetails;