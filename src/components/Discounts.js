import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/DiscountsStyles.css";
import config from "../config";;

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetchWithAuth(`${config.backendUrl}/api/v1/discounts`);
      setDiscounts(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;

    try {
      await fetchWithAuth(`${config.backendUrl}/api/v1/discounts/${discountId}`, {
        method: "DELETE",
      });
      alert("Discount deleted successfully.");
      fetchDiscounts();
    } catch (err) {
      alert("Failed to delete discount: " + err.message);
    }
  };

  return (
    <div className="discounts-container">
      <h1>Discounts Management</h1>
      {error && <p className="error">{error}</p>}
      <table className="discounts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Percentage</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.id}>
              <td>{discount.name}</td>
              <td>{discount.disountPercentage}%</td>
              <td>{new Date(discount.startDate).toLocaleDateString()}</td>
              <td>{new Date(discount.endDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => navigate(`/discounts/${discount.id}`)}>View</button>
                <button onClick={() => navigate(`/discounts/edit/${discount.id}`)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteDiscount(discount.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Discounts;
