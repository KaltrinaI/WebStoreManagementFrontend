import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/FormStyles.css";

function AddProduct() {
  const navigate = useNavigate();

  // New product state with default (empty) values
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

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle form submission to add a new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation: check if all fields are filled
    if (
      !product.name ||
      !product.description ||
      !product.price ||
      !product.quantity ||
      !product.categoryName ||
      !product.brandName ||
      !product.genderName ||
      !product.colorName ||
      !product.sizeName
    ) {
      setError("All fields are required.");
      return;
    }

    // Optionally, convert price and quantity to numeric types before sending
    const productToSend = {
      ...product,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
    };

    try {
      // Call the POST endpoint to add a new product
      await fetchWithAuth(`https://localhost:7059/api/v1/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSend),
      });

      alert("Product added successfully!");
      navigate("/manage-products");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-container">
      <h1 className="add-title">Add Product</h1>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="add-form-group">
          <label className="add-label">Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        <div className="add-form-group">
          <label className="add-label">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        <div className="add-form-group">
          <label className="add-label">Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        <div className="add-form-group">
          <label className="add-label">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        <div className="add-form-group">
          <label className="add-label">Category:</label>
          <input
            type="text"
            name="categoryName"
            value={product.categoryName}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        <div className="add-form-group">
          <label className="add-label">Brand:</label>
          <input
            type="text"
            name="brandName"
            value={product.brandName}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        <div className="add-form-group">
          <label className="add-label">Gender:</label>
          <input
            type="text"
            name="genderName"
            value={product.genderName}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        <div className="add-form-group">
          <label className="add-label">Color:</label>
          <input
            type="text"
            name="colorName"
            value={product.colorName}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        <div className="add-form-group">
          <label className="add-label">Size:</label>
          <input
            type="text"
            name="sizeName"
            value={product.sizeName}
            onChange={handleChange}
            className="add-input"
            required
          />
        </div>

        {error && <div className="add-error">{error}</div>}
        <button type="submit" className="add-button">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
