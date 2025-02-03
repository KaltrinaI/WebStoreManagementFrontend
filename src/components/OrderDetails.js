import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../style/OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7059/api/v1/orders/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      <p><strong>Status:</strong> {order.orderStatus}</p>
      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
      <p><strong>User Email:</strong> {order.userEmail}</p>

      <h3>Items:</h3>
      <ul>
        {order.orderItems.map((item, index) => (
          <li key={index} className="order-item">
            <p><strong>Product:</strong> {item.product.name}</p>
            <p><strong>Description:</strong> {item.product.description}</p>
            <p><strong>Category:</strong> {item.product.categoryName}</p>
            <p><strong>Brand:</strong> {item.product.brandName}</p>
            <p><strong>Color:</strong> {item.product.colorName}</p>
            <p><strong>Size:</strong> {item.product.sizeName}</p>
            <p><strong>Price:</strong> ${item.product.price}</p>
            <p><strong>Discounted Price:</strong> {item.product.discountedPrice > 0 ? `$${item.product.discountedPrice}` : "No Discount"}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
          </li>
        ))}
      </ul>
      <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/view-orders")}
          >Go Back</button>
    </div>
  );
};

export default OrderDetails;
