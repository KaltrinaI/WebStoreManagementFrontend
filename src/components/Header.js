import React from "react";
import "../style/Header.css";

const Header = ({ onLogout }) => {
  return (
    <header className="admin-header">
      <h1 className="admin-title">Prestige Admin Panel</h1>
      <button className="logout-button1" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
