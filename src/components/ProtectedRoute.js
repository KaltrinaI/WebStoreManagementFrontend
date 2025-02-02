import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {

    const storedRole = localStorage.getItem("userRole");
  if (!storedRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(storedRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
