import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Named import for newer versions

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Check if the token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    console.error("Token decode error:", err);
    return <Navigate to="/" replace />;
  }

  // If the token is valid, render the children components
  return children;
};

export default ProtectedRoute;
