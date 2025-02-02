import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Welcome from "./components/Welcome";
import Shop from "./components/Shop";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import EditProduct from "./components/EditProduct";
import Orders from "./components/Orders";
import Reports from "./components/Reports";
import Users from "./components/Users";
import ResetPassword from "./components/ResetPassword";
import Discounts from "./components/Discounts";
import DiscountDetails from "./components/DiscountDetails"
import EditDiscount from "./components/EditDiscount";
import EditUser from "./components/EditUser";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setUserRole(storedRole);
  }, []);
  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        role={userRole}
        setRole={setUserRole}
      />
    </Router>
  );
}

function AppContent({ isAuthenticated, setIsAuthenticated, role, setRole }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    const userRole = localStorage.getItem("role") || "User";
    setIsAuthenticated(true);
    setRole(userRole);
    navigate("/welcome")
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, []);

  return (
    <div className="App">
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <div className="main-layout">
        {isAuthenticated && role !== "User" && (
          <div className="sidebar">
            <TabBar role={role} />
          </div>
        )}
 <div className="content">
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<SignIn onLogin={handleLogin} />} />
    <Route path="/register" element={<SignUp />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/shop" element={<Shop />} />
    
    {/* Products */}
    <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
    <Route path="/view-products" element={<Products />} />
    <Route path="/products/view/:id" element={<ProductDetails />} />
    <Route path="/products/edit/:id" element={<EditProduct />} />
    </Route>

    {/* Orders */}
    <Route path="/view-orders" element={<Orders />} />

    {/* Discounts */}
    <Route path="/view-discounts" element={<Discounts />} />
    <Route path="/discounts/view/:id" element={<DiscountDetails />} />
    <Route path="/discounts/edit/:id" element={<EditDiscount />} />

    {/* Reports */}
    <Route path="/view-reports" element={<Reports />} />

    {/* Users */}
    <Route path="/view-users" element={<Users />} />
    <Route path="/users/edit/:id" element={<EditUser />} />
  </Routes>
</div>

      </div>
    </div>
  );
}

export default App;
