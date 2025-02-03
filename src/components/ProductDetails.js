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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${config.backendUrl}/api/v1/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Product deleted successfully");
        navigate("/view-products");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete product: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the product.");
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
          <p><strong>Discounted Price:</strong> ${product.discountedPrice.toFixed(2)}</p>
          <p><strong>Quantity:</strong> {product.quantity}</p>
          <p><strong>Gender:</strong> {product.genderName}</p>
          <p><strong>Brand:</strong> {product.brandName}</p>
          <p><strong>Category:</strong> {product.categoryName}</p>
          <p><strong>Color:</strong> {product.colorName}</p>
          <p><strong>Size:</strong> {product.sizeName}</p>
          
          <div className="product-details-actions">
            <button onClick={() => navigate(`/products/edit/${id}`)} className="btn-edit">
              Edit
            </button>
            <button onClick={handleDelete} className="btn-delete">
              Delete
            </button>
          </div>
        </div>
      )}
      <button onClick={() => navigate(-1)} className="btn-back">
        Back
      </button>
    </div>
  );
}

export default ProductDetails;
