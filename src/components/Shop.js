import React, { useState, useEffect } from "react";
import "../style/Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({}); // Store user-selected quantities

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://localhost:7059/api/v1/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] ? parseInt(quantities[productId]) : 1; // Default to 1
    if (quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      alert("Product not found.");
      return;
    }

    const orderData = {
      orderItems: [
        {
          productId: productId,
          quantity: quantity,
          price: product.price,
        },
      ],
    };

    try {
      const response = await fetch("https://localhost:7059/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      alert(`Order for ${quantity} x ${product.name} created successfully!`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="shop-loading">Loading...</div>;
  if (error) return <div className="shop-error">Error: {error}</div>;

  return (
    <div className="shop-container">
      <h1 className="shop-title">Shop</h1>
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.description}</p>

              {/* Quantity Input */}
              <div className="quantity-container">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  className="quantity-input"
                />
              </div>

              <button
                onClick={() => handleAddToCart(product.id)}
                className="btn-add-to-cart"
              >
                Order
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

export default Shop;
