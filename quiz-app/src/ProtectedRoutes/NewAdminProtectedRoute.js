import React from "react";
import { Navigate } from "react-router-dom";
import { isNewAdminAuthenticated } from "../utils/NewAdminauth"; // Create this function to verify new admin token

const NewAdminProtectedRoute = ({ children }) => {
  return isNewAdminAuthenticated() ? children : <Navigate to="/newadmin/newAdmindashboard" />;
};

export default NewAdminProtectedRoute;
