import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear(); // Destroy session
    navigate("/login"); // Redirect to login page
  };

  const sections = [
    { name: "Manage Products", route: "/manage-products" },
    { name: "Manage Orders", route: "/view-orders" },
    { name: "Manage Discounts", route: "/view-discounts" },
    { name: "Manage Reports", route: "/view-reports" },
    { name: "View Shop", route: "/shop" },
    { name: "Manage Users", route: "/view-users" },
  ];

  return (
    <div className="welcome-container">
      <h1>Prestige Shop - Admin Panel</h1>
      <div className="sections-container">
        {sections.map((section, index) => (
          <div
            key={index}
            className="section-box"
            onClick={() => navigate(section.route)}
          >
            {section.name}
          </div>
        ))}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Welcome;
