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

      if (!Array.isArray(response)) {
        throw new Error("Invalid response format");
      }

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
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Discount deleted successfully.");
      fetchDiscounts();
    } catch (err) {
      alert("Failed to delete discount: " + err.message);
    }
  };

  return (
    <div className="discounts-container">
      <h1 className="discounts-title">Discounts Management</h1>
      <button className="btn-save" onClick={() => navigate("/add-discount")}>
  Add Discount
</button>

<button
            type="button"
            className="btn-back"
            onClick={() => navigate("/welcome")}
          >Go Back</button>


      {error && <p className="error">{error}</p>}

      {discounts.length === 0 ? (
        <p className="discounts-empty">No discounts available.</p>
      ) : (
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
                <td>{discount.discountPercentage}%</td> 
                <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn-edit" onClick={() => navigate(`/discounts/edit/${discount.id}`)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDeleteDiscount(discount.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Discounts;
