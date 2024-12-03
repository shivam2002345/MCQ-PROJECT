import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NewAdminLogin.css";

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

        // Redirect to dashboard on successful login
        navigate("/newadmin/newAdmindashboard");
      } catch (error) {
        setErrorResponse(
          error.response ? error.response.data.message : "Something went wrong"
        );
      }
    },
  });

  // Handle Return to Home click
  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={formik.handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.email && formik.errors.email ? "error" : ""}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.password && formik.errors.password ? "error" : ""}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>

      {errorResponse && (
        <div className="response error">
          <strong>Error:</strong> {errorResponse}
        </div>
      )}

      <button onClick={handleReturnHome} className="return-home-button">
        Return to Home
      </button>
    </div>
  );
};

export default NewAdminLogin;
