import React from "react";
import "../style/Welcome.css";

const Welcome = ({ onLogout }) => {
  return (
    <div className="welcome-container">
      <h1>Prestige Shop - Admin Panel</h1>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Welcome;
