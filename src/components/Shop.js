import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // Holds quantity per product (for product list)
  const [cart, setCart] = useState([]); // Holds products added to the cart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  // Helper: Extract the email from the JWT token stored in localStorage.
  // The email is stored in the claim: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
  const getEmailFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    } catch (error) {
      console.error("Error decoding token:", error);
      return "";
    }
  };

  // Fetch products when the component mounts
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

  // Handle changes in quantity input for each product
  const handleQuantityChange = (productId, value) => {
    const quantity = parseInt(value, 10) || 1;
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  // Add product to cart (or update quantity if it already exists)
  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    // Optionally, reset the quantity input for that product to 1
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  // Update quantity for an item in the cart
  const updateCartQuantity = (productId, value) => {
    const quantity = parseInt(value, 10) || 1;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Remove an item from the cart
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  // Build the order payload and send it to the backend
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Create orderItems array with only productId and quantity
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    // Build the full order JSON payload
    const orderData = {
      orderDate: new Date().toISOString(),
      email: getEmailFromToken(),
      orderItems: orderItems,
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      alert("Order placed successfully!");
      setCart([]); // Clear the cart on success
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="shop-loading">Loading...</div>;
  if (error) return <div className="shop-error">Error: {error}</div>;

  return (
    <div className="shop-container">
      <h1 className="shop-title">Shop</h1>
      <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/welcome")}
          >Go Back</button>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              {/* You can include an image or other product info here */}
              <div className="product-name">{product.name}</div>
              <div className="product-price">${product.price.toFixed(2)}</div>
              <div className="product-description">{product.description}</div>
              <div className="add-to-cart-area">
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  className="quantity-input"
                />
                <br></br>
                <button
                  onClick={() => addToCart(product)}
                  className="btn-add-to-cart"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>

      {/* Cart Section (styled with your existing design plus the cart CSS snippet provided earlier) */}
      <section className="cart-section">
        <h2 className="cart-title">Your Cart</h2>
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.product.id} className="cart-item">
              <span className="cart-item-name">{item.product.name}</span>
              <span className="cart-item-quantity">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateCartQuantity(item.product.id, e.target.value)
                  }
                  className="cart-quantity-input"
                />
              </span>
              <span className="cart-item-price">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="btn-remove-from-cart"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          Total: $
          {cart
            .reduce((total, item) => total + item.product.price * item.quantity, 0)
            .toFixed(2)}
        </div>
        <button onClick={handlePlaceOrder} className="btn-place-order">
          Place Order
        </button>
      </section>
    </div>
  );
}

export default Shop;
