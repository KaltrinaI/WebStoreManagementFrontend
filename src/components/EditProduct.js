import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/FormStyles.css";
import config from "../config";;

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Product State
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryName: "",
    brandName: "",
    genderName: "",
    colorName: "",
    sizeName: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const data = await fetchWithAuth(`${config.backendUrl}/api/v1/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!product.name || !product.description || product.price > 0 || !product.categoryName || !product.brandName || !product.genderName || !product.colorName || !product.sizeName) {
      setError("All fields are required.");
      return;
    }

    try {
      await fetchWithAuth(`${config.backendUrl}/api/v1/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      });

      alert("Product updated successfully!");
      navigate("/view-products");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="add-error">{error}</div>;

  return (
    <div className="add-container">
      <h1 className="add-title">Edit Product</h1>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="add-form-group">
          <label className="add-label">Name:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="add-input" required />
        </div>

        <div className="add-form-group">
          <label className="add-label">Description:</label>
          <textarea name="description" value={product.description} onChange={handleChange} className="add-input" required />
        </div>

        <div className="add-form-group">
          <label className="add-label">Price:</label>
          <input type="number" step="0.01" name="price" value={product.price} onChange={handleChange} className="add-input" required />
        </div>

        <div className="add-form-group">
          <label className="add-label">Quantity:</label>
          <input type="number" name="quantity" value={product.quantity} onChange={handleChange} className="add-input" required />
        </div>

        <div className="add-form-group">
          <label className="add-label">Category:</label>
          <input type="text" name="categoryName" value={product.categoryName} onChange={handleChange} className="add-input" required />
        </div>

        <div className="add-form-group">
          <label className="add-label">Brand:</label>
          <input type="text" name="brandName" value={product.brandName} onChange={handleChange} className="add-input" required />
        </div>

        <div className="add-form-group">
          <label className="add-label">Gender:</label>
          <input type="text" name="genderName" value={product.genderName} onChange={handleChange} className="add-input" required />
        </div>

        <div className="add-form-group">
          <label className="add-label">Color:</label>
          <input type="text" name="colorName" value={product.colorName} onChange={handleChange} className="add-input" required />
        </div>

        <div className="add-form-group">
          <label className="add-label">Size:</label>
          <input type="text" name="sizeName" value={product.sizeName} onChange={handleChange} className="add-input" required />
        </div>

        <button type="submit" className="add-button">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct;
