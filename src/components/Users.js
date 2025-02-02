import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import "../style/UsersStyles.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetchWithAuth("https://localhost:7059/api/v1/users");
      setUsers(response.users);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetchWithAuth(`https://localhost:7059/api/v1/users/${userId}`, {
        method: "DELETE",
      });
      alert("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <div className="users-container">
      <h1>User Management</h1>
      {error && <p className="error">{error}</p>}
      <table className="users-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber || "N/A"}</td>
              <td>
                <button onClick={() => navigate(`/users/edit/${user.id}`)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
                <button onClick={() => navigate(`/users/reset-password/${user.id}`)}>
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
