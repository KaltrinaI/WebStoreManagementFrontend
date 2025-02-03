import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/OrdersStyles.css";
import config from "../config";;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  const orderStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled",
    "Completed",
  ];

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Fetch all orders
  const fetchAllOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.backendUrl}/api/v1/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${config.backendUrl}/api/v1/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      alert("Order canceled successfully!");
      fetchAllOrders();
    } catch (err) {
      console.error("Cancel order error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");

    try {
      setUpdating(orderId);

      const response = await fetch(
        `${config.backendUrl}/api/v1/orders/${orderId}/status/${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStatus),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      alert("Order status updated successfully!");
      fetchAllOrders();
    } catch (err) {
      console.error("Update order status error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleViewOrderDetails = (id) => {
    navigate(`/orders/view/${id}`);
  };

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders List</h1>
      <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/welcome")}
          >Go Back</button>
      {loading && <div className="orders-loading">Loading...</div>}
      {error && <div className="orders-error">Error: {error}</div>}

      {orders.length === 0 && !loading ? (
        <p className="orders-empty">No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Date</th>
              <th>Status</th>
              <th>User Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>{order.orderStatus}</td>
                <td>{order.userEmail}</td>
                <td>
                  <button
                    onClick={() => handleViewOrderDetails(order.id)}
                    className="btn-view-order"
                  >
                    View Details
                  </button>

                  {/* Cancel Order Button (Only if not already canceled) */}
                  {order.orderStatus !== "Canceled" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="btn-cancel-order"
                    >
                      Cancel Order
                    </button>
                  )}

                  {/* Order Status Update Dropdown */}
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleUpdateOrderStatus(order.id, e.target.value)
                    }
                    disabled={updating === order.id}
                    className="status-dropdown"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
