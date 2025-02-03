import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/EditDiscountStyles.css";

function EditDiscount() {
  const { id } = useParams();
  const [discount, setDiscount] = useState({
    name: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDiscount();
  }, []);

  const fetchDiscount = async () => {
    try {
      const response = await fetchWithAuth(`https://localhost:7059/api/v1/discounts/${id}`);
      setDiscount({
        name: response.name,
        discountPercentage: response.discountPercentage,
        startDate: response.startDate ? response.startDate.split("T")[0] : "",
        endDate: response.endDate ? response.endDate.split("T")[0] : "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setDiscount({ ...discount, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetchWithAuth(`https://localhost:7059/api/v1/discounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(discount),
      });
      alert("Discount updated successfully.");
      navigate("/view-discounts");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="edit-discount-container">
      <h1 className="edit-discount-title">Edit Discount</h1>
      {error && <p className="error">{error}</p>}
       
        <form className="edit-discount-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            className="edit-discount-input"
            value={discount.name}
            onChange={handleChange}
            required
          />

          <label>Discount Percentage:</label>
          <input
            type="number"
            name="discountPercentage"
            className="edit-discount-input"
            value={discount.discountPercentage}
            onChange={handleChange}
            required
          />

          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            className="edit-discount-input"
            value={discount.startDate}
            onChange={handleChange}
            required
          />

          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            className="edit-discount-input"
            value={discount.endDate}
            onChange={handleChange}
            required
          />

          <div className="edit-discount-actions">
            <button type="submit" className="btn-save">Update Discount</button>
            <button type="button" className="btn-cancel" onClick={() => navigate("/view-discounts")}>
              Cancel
            </button>
          </div>
        </form>
    
    </div>
  );
}

export default EditDiscount;