import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/userAuth"; // Function to verify user token

const UserProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signin" />;
};

export default UserProtectedRoute;
