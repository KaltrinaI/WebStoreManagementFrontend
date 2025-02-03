import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "./fetchWithAuth";
import "../style/FormStyles.css";
import config from "../config";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [gender, setGender] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [error, setError] = useState(null);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Fetch categories, brands, colors, and sizes (could be from an API)
  useEffect(() => {
    setBrands(["Adidas", "Nike", "Zara", "Levi's", "H&M"]);
    setCategories(["Casual Wear", "Formal Wear", "Sports Wear", "Outerwear", "Footwear"]);
    setColors(["Denim Blue", "Heather Gray", "Olive Green", "Mustard Yellow", "Rust", "Burgundy", "Navy", "Dusty Rose"]);
    setSizes(["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !quantity || !gender || !brand || !category || !color || !size) {
      setError("All fields are required.");
      return;
    }

    const productData = {
      Name: name,
      Description: description,
      Price: parseFloat(price),
      Quantity: parseInt(quantity),
      GenderName: gender,
      BrandName: brand,
      CategoryName: category,
      ColorName: color,
      SizeName: size,
    };

    try {
      const response = await fetchWithAuth(`${config.backendUrl}/api/v1/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add product.");
      }

      // Reset form and show success message
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setGender("");
      setBrand("");
      setCategory("");
      setColor("");
      setSize("");
      setError(null);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="add-container">
      <h1 className="add-title">Add Product</h1>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="add-form-group">
          <label className="add-label">Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="add-input" required />
        </div>
        <div className="add-form-group">
          <label className="add-label">Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="add-input" required />
        </div>
        <div className="add-form-group">
          <label className="add-label">Price:</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="add-input" required />
        </div>
        <div className="add-form-group">
          <label className="add-label">Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="add-input" required />
        </div>
        <div className="add-form-group">
          <label className="add-label">Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="add-input" required>
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NEUTRAL">Neutral</option>
          </select>
        </div>
        <div className="add-form-group">
          <label className="add-label">Brand:</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="add-input" required>
            <option value="">Select Brand</option>
            {brands.map((brandName, index) => (
              <option key={index} value={brandName}>
                {brandName}
              </option>
            ))}
          </select>
        </div>
        <div className="add-form-group">
          <label className="add-label">Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="add-input" required>
            <option value="">Select Category</option>
            {categories.map((categoryName, index) => (
              <option key={index} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="add-form-group">
          <label className="add-label">Color:</label>
          <select value={color} onChange={(e) => setColor(e.target.value)} className="add-input" required>
            <option value="">Select Color</option>
            {colors.map((colorName, index) => (
              <option key={index} value={colorName}>
                {colorName}
              </option>
            ))}
          </select>
        </div>
        <div className="add-form-group">
          <label className="add-label">Size:</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="add-input" required>
            <option value="">Select Size</option>
            {sizes.map((sizeLabel, index) => (
              <option key={index} value={sizeLabel}>
                {sizeLabel}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="add-button">
          Add Product
        </button>
      </form>
      {error && <p className="add-error">{error}</p>}
    </div>
  );
}

export default AddProduct;
