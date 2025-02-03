import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/UserFormStyles.css";
import config from "../config";;

function EditUser() {
  const { userId } = useParams();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        body: JSON.stringify(user),
      });
      alert("User updated successfully!");
      navigate("/users");
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
        <input type="text" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} required />

        <label>Last Name:</label>
        <input type="text" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} required />

        <label>Phone Number:</label>
        <input type="text" value={user.phoneNumber} onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} />

        <button type="submit">Update</button>
      </form>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
}

export default EditUser;
