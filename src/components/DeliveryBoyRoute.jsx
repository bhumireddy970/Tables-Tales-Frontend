import React from "react";
import { Navigate } from "react-router-dom";

const DeliveryBoyRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("email");
  const isAdmin = localStorage.getItem("role") === "ADMIN";
  const isDeliveryBoy = localStorage.getItem("role") === "DELIVERYBOY";
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (isAdmin || isDeliveryBoy) return children;
  return <Navigate to="/needaccess" replace />;
};

export default DeliveryBoyRoute;
