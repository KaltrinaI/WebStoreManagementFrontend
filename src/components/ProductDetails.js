import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/ProductDetailsStyles.css";
import config from "../config";;

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/v1/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Product not found.");
        throw new Error("Failed to fetch product details.");
      }

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="product-details-loading">Loading...</div>;
  if (error) return <div className="product-details-error">Error: {error}</div>;

  return (
    <div className="product-details-container">
      <h1 className="product-details-title">Product Details</h1>
      {product && (
        <div className="product-details-content">
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Quantity:</strong> {product.quantity}</p>
          <p><strong>Gender:</strong> {product.genderName}</p>
          <p><strong>Brand:</strong> {product.brandName}</p>
          <p><strong>Category:</strong> {product.categoryName}</p>
          <p><strong>Color:</strong> {product.colorName}</p>
          <p><strong>Size:</strong> {product.sizeName}</p>
        </div>
      )}
      <button onClick={() => navigate(-1)} className="btn-back">
        Back
      </button>
    </div>
  );
}

export default ProductDetails;
