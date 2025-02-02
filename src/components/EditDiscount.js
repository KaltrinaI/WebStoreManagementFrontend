import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/EditDiscountStyles.css";

function EditDiscount() {
  const { id } = useParams();
  const [discount, setDiscount] = useState({
    name: "",
    disountPercentage: "",
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
      setDiscount(response);
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
      navigate("/discounts");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="edit-discount-container">
      <h1>Edit Discount</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={discount.name} onChange={handleChange} required />

        <label>Discount Percentage:</label>
        <input type="number" name="disountPercentage" value={discount.disountPercentage} onChange={handleChange} required />

        <label>Start Date:</label>
        <input type="date" name="startDate" value={discount.startDate} onChange={handleChange} required />

        <label>End Date:</label>
        <input type="date" name="endDate" value={discount.endDate} onChange={handleChange} required />

        <button type="submit">Update Discount</button>
        <button onClick={() => navigate("/discounts")}>Cancel</button>
      </form>
    </div>
  );
}

export default EditDiscount;
