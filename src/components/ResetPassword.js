import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/AuthFormStyles.css";
import logo from "../images/design.png";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("https://localhost:7059/api/v1/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        setSuccess("Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Password reset failed.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Logo" className="auth-logo" />
      <h2 className="auth-title">Reset Password</h2>

      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}

      <form onSubmit={handleResetPassword} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="auth-button">Reset Password</button>
      </form>

      <button onClick={() => navigate("/login")} className="switch-button">Back to Login</button>
    </div>
  );
}

export default ResetPassword;
