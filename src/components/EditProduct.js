import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import config from "../config";;
import "../style/EditProductStyles.css";


function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Product State – includes discountedPrice (not shown in the form)
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discountedPrice: "0", // default value (as string)
    quantity: "",
    categoryName: "",
    brandName: "",
    genderName: "",
    colorName: "",
    sizeName: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details when the component mounts or id changes
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await fetchWithAuth(`${config.backendUrl}/api/v1/products/${id}`);
      setProduct({
        name: data.name || "",
        description: data.description || "",
        price: data.price ? data.price.toString() : "",
        discountedPrice: data.discountedPrice ? data.discountedPrice.toString() : "0",
        quantity: data.quantity ? data.quantity.toString() : "",
        categoryName: data.categoryName || "",
        brandName: data.brandName || "",
        genderName: data.genderName || "",
        colorName: data.colorName || "",
        sizeName: data.sizeName || "",
      });
      setLoading(false);
    } catch (err) {
      setError(err?.message || "An error occurred while fetching product details.");
      setLoading(false);
    }
  };

  // Handle input changes (discountedPrice is not handled because it’s not in the form)
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

    // Validate required fields and numeric values.
    if (
      !product.name ||
      !product.description ||
      !product.price ||
      isNaN(product.price) ||
      parseFloat(product.price) <= 0 ||
      !product.quantity ||
      isNaN(product.quantity) ||
      parseInt(product.quantity, 10) < 0 ||
      !product.categoryName ||
      !product.brandName ||
      !product.genderName ||
      !product.colorName ||
      !product.sizeName
    ) {
      setError("All fields are required and must have valid values.");
      return;
    }

    // Build payload – exclude the discountedPrice from user input.
    // Here we set discountedPrice to 0 (or you can preserve the existing value if desired).
    const productToSend = {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      discountedPrice: 0,  // Not editable by the user.
      quantity: parseInt(product.quantity, 10),
      categoryName: product.categoryName,
      brandName: product.brandName,
      genderName: product.genderName,
      colorName: product.colorName,
      sizeName: product.sizeName,
    };

    try {
      await fetchWithAuth(`${config.backendUrl}/api/v1/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToSend),
      });

      alert("Product updated successfully!");
      navigate("/manage-products");
    } catch (err) {
      setError(err?.message || "An error occurred while updating the product.");
    }
  };

  if (loading) return <div className="loading-message">Loading product details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-product-container">
      <h1 className="edit-product-title">Edit Product</h1>
      <form onSubmit={handleSubmit} className="edit-product-form">
        {/* Name */}
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="edit-product-input"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="edit-product-textarea"
            required
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label className="form-label">Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="edit-product-input"
            required
          />
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label className="form-label">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="edit-product-input"
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category:</label>
          <input
            type="text"
            name="categoryName"
            value={product.categoryName}
            onChange={handleChange}
            className="edit-product-input"
            required
          />
        </div>

        {/* Brand */}
        <div className="form-group">
          <label className="form-label">Brand:</label>
          <input
            type="text"
            name="brandName"
            value={product.brandName}
            onChange={handleChange}
            className="edit-product-input"
            required
          />
        </div>

        {/* Gender */}
        <div className="form-group">
          <label className="form-label">Gender:</label>
          <input
            type="text"
            name="genderName"
            value={product.genderName}
            onChange={handleChange}
            className="edit-product-input"
            required
          />
        </div>

        {/* Color */}
        <div className="form-group">
          <label className="form-label">Color:</label>
          <input
            type="text"
            name="colorName"
            value={product.colorName}
            onChange={handleChange}
            className="edit-product-input"
            required
          />
        </div>

        {/* Size */}
        <div className="form-group">
          <label className="form-label">Size:</label>
          <input
            type="text"
            name="sizeName"
            value={product.sizeName}
            onChange={handleChange}
            className="edit-product-input"
            required
          />
        </div>

        <div className="edit-product-actions">
          <button type="submit" className="btn-save">Update Product</button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/manage-products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
