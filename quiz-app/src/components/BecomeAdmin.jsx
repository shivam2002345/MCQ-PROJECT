import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate  } from "react-router-dom"; 
import './BecomeAdmin.css';  // Import the CSS file for better structure
import logo from '../assets/logo.png'
import UserNavbar from "./Navbar";
const BecomeAdmin = () => {
  const navigate = useNavigate(); // Initialize useHistory hook for redirection

  // State for form visibility
  const [step, setStep] = useState(1);

  // Validation schema for all mandatory fields
  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    note: yup.string().required("Note is required"),
    organisation_name: yup.string().required("Organisation name is required"),
    organisation_address: yup.string().required("Organisation address is required"),
    designation: yup.string().required("Designation is required"),
    mobile_no: yup.string().required("Mobile number is required"),
    reason_to_be_admin: yup.string().required("Reason to become admin is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      note: "",
      organisation_name: "",
      organisation_address: "",
      designation: "",
      mobile_no: "",
      reason_to_be_admin: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Log data before sending
        console.log("Submitting values:", values);
    
        // Axios POST request with headers
        const response = await axios.post(
          "http://localhost:8080/api/admin/request",
          values,
          {
            headers: {
              "Content-Type": "application/json", // Ensure JSON header is set
            },
          }
        );
        alert(`Request submitted successfully! Message: ${response.data.message}`);
        resetForm();
      } catch (error) {
        console.error("Error submitting request:", error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.message || "An unknown error occurred"}`);
      }
    }
  })

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  // Redirect to home page
  const handleLogoClick = () => {
    navigate('/');  };

  return (
    <>

    <UserNavbar/>
    <div className="form-container">
      {/* Logo with dark background */}
      <div className="header">
        <img
          src={logo} // Replace with the actual path to your logo image
          alt="Company Logo"
          className="logo"
          onClick={handleLogoClick} // Handle logo click
        />
      </div>

      <h2 className="form-title">Become an Admin</h2>
      <form onSubmit={formik.handleSubmit} className="form-content">
        {/* Step 1 - Personal Details */}
        {step === 1 && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-input"
                />
                {formik.touched.name && formik.errors.name && (
                  <span className="error">{formik.errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-input"
                />
                {formik.touched.email && formik.errors.email && (
                  <span className="error">{formik.errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-input"
                />
                {formik.touched.password && formik.errors.password && (
                  <span className="error">{formik.errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="note">Note:</label>
                <textarea
                  id="note"
                  name="note"
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-input textarea"
                />
                {formik.touched.note && formik.errors.note && (
                  <span className="error">{formik.errors.note}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="organisation_name">Organisation Name:</label>
                <input
                  type="text"
                  id="organisation_name"
                  name="organisation_name"
                  value={formik.values.organisation_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-input"
                />
                {formik.touched.organisation_name && formik.errors.organisation_name && (
                  <span className="error">{formik.errors.organisation_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="organisation_address">Organisation Address:</label>
                <textarea
                  id="organisation_address"
                  name="organisation_address"
                  value={formik.values.organisation_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-input textarea"
                />
                {formik.touched.organisation_address && formik.errors.organisation_address && (
                  <span className="error">{formik.errors.organisation_address}</span>
                )}
              </div>
            </div>

            <button type="button" onClick={handleNext} className="next-button">
              Next
            </button>
          </>
        )}

        {/* Step 2 - Contact and Reason */}
        {step === 2 && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="designation">Designation:</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-input"
                />
                {formik.touched.designation && formik.errors.designation && (
                  <span className="error">{formik.errors.designation}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="mobile_no">Mobile Number:</label>
                <input
                  type="text"
                  id="mobile_no"
                  name="mobile_no"
                  value={formik.values.mobile_no}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-input"
                />
                {formik.touched.mobile_no && formik.errors.mobile_no && (
                  <span className="error">{formik.errors.mobile_no}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason_to_be_admin">Reason to Become Admin:</label>
              <textarea
                id="reason_to_be_admin"
                name="reason_to_be_admin"
                value={formik.values.reason_to_be_admin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-input textarea"
              />
              {formik.touched.reason_to_be_admin && formik.errors.reason_to_be_admin && (
                <span className="error">{formik.errors.reason_to_be_admin}</span>
              )}
            </div>

            <button type="button" onClick={handleBack} className="back-button">
              Back
            </button>

            <button type="submit" className="submit-button">
              Submit Request
            </button>
          </>
        )}
      </form>
    </div>
    </>
  );
};

export default BecomeAdmin;
