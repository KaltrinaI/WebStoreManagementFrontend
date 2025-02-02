import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/DiscountDetailsStyles.css";

function DiscountDetails() {
  const { id } = useParams();
  const [discount, setDiscount] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscount();
  }, []);

  const fetchDiscount = async () => {
    try {
      const response = await fetchWithAuth(`https://localhost:7059/api/v1/discounts/${id}`);
      setDiscount(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;

    try {
      await fetchWithAuth(`https://localhost:7059/api/v1/discounts/${id}`, {
        method: "DELETE",
      });
      alert("Discount deleted successfully.");
      navigate("/discounts");
    } catch (err) {
      alert("Failed to delete discount: " + err.message);
    }
  };

  if (!discount) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="discount-details-container">
      <h1>Discount Details</h1>
      <p><strong>Name:</strong> {discount.name}</p>
      <p><strong>Discount Percentage:</strong> {discount.disountPercentage}%</p>
      <p><strong>Start Date:</strong> {new Date(discount.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(discount.endDate).toLocaleDateString()}</p>

      <button onClick={() => navigate(`/discounts/edit/${discount.id}`)}>Edit</button>
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
      <button onClick={() => navigate("/discounts")}>Back</button>
    </div>
  );
}

export default DiscountDetails;
