import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/TabBar.css";

function TabBar({ role }) {
  const navigate = useNavigate();

  return (
    <div className="tab-bar">
      {(role === "Admin" ||
        role === "Advanced User" ||
        role === "Simple User") && (
        <button className="tab-item" onClick={() => navigate("/view-products")}>
          Products
        </button>
      )}
      {(role === "Admin" || role === "Advanced User") && (
        <button className="tab-item" onClick={() => navigate("/view-orders")}>
          Orders
        </button>
      )}
      {role === "Admin" && (
        <>
          <button
            className="tab-item"
            onClick={() => navigate("/view-catalogs")}
          >
            Catalogs
          </button>
          <button
            className="tab-item"
            onClick={() => navigate("/view-discounts")}
          >
            Discounts
          </button>
          <button
            className="tab-item"
            onClick={() => navigate("/view-customers")}
          >
            Customers
          </button>
          <button
            className="tab-item"
            onClick={() => navigate("/view-reports")}
          >
            Reports
          </button>
        </>
      )}
    </div>
  );
}

export default TabBar;
