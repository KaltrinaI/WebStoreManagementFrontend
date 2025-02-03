import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/UserFormStyles.css";
import config from "../config";;

function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetchWithAuth(`${config.backendUrl}/api/v1/users/${userId}`);
      setUser(response.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth(`${config.backendUrl}/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`

        },
        body: JSON.stringify(user),
      });
      alert("User updated successfully!");
      navigate("/view-users");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="user-form-container">
      <h1>Edit User</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleUpdate}>
        <label>First Name:</label>
        <input 
          type="text" 
          value={user.firstName} 
          onChange={(e) => setUser({ ...user, firstName: e.target.value })} 
          required 
        />

        <label>Last Name:</label>
        <input 
          type="text" 
          value={user.lastName} 
          onChange={(e) => setUser({ ...user, lastName: e.target.value })} 
          required 
        />

        <label>Phone Number:</label>
        <input 
          type="text" 
          value={user.phoneNumber} 
          onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} 
        />

        <button type="submit" className="btn-update">Update</button>
      </form>
      <button className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
}

export default EditUser;
