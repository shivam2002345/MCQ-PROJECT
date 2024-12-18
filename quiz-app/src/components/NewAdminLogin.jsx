import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NewAdminLogin.css";
import  logAction  from '../utils/logAction'; // Import logAction function

const NewAdminLogin = () => {
  const [errorResponse, setErrorResponse] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Validation schema
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/admin/newadmin/login",
          values
        );
        // Accessing admin_id from response data
        const admin_id = response.data.admin.admin_id;
        localStorage.setItem("admin_id", admin_id);

        // Log the successful login action
        logAction(admin_id, 'admin logged in successfully');

        // Redirect to dashboard on successful login
        navigate("/newadmin/newAdmindashboard");
      } catch (error) {
        setErrorResponse(
          error.response ? error.response.data.message : "Something went wrong"
        );
        
        // Log the failed login action
        const adminIdFromStorage = localStorage.getItem("admin_id");
        logAction(adminIdFromStorage, 'admin failed to log in');
      }
    },
  });

  // Handle Return to Home click
  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="external-admin-login-container">
      <h2 className="external-admin-login-header">Admin Login</h2>
      <form onSubmit={formik.handleSubmit} className="external-admin-form-card">
        <div className="external-admin-form-group">
          <label htmlFor="email" className="external-admin-form-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`external-admin-form-input ${formik.touched.email && formik.errors.email ? "error" : ""}`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="external-admin-error-message">{formik.errors.email}</div>
          )}
        </div>

        <div className="external-admin-form-group">
          <label htmlFor="password" className="external-admin-form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`external-admin-form-input ${formik.touched.password && formik.errors.password ? "error" : ""}`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="external-admin-error-message">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className="external-admin-submit-button">
          Login
        </button>
      </form>

      {errorResponse && (
        <div className="response error">
          <strong>Error:</strong> {errorResponse}
        </div>
      )}

      <button onClick={handleReturnHome} className="external-admin-return-home-button">
        Return to Home
      </button>
    </div>
  );
};

export default NewAdminLogin;
