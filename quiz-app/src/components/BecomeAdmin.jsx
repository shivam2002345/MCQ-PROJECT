import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './BecomeAdmin.css';
import logo from '../assets/logo.png';
import UserNavbar from "./Navbar";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';  // Add the CSS for the PhoneInput component

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
        logAction("Submitted admin request", values);
      } catch (error) {
        console.error("Error submitting request:", error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.message || "An unknown error occurred"}`);
        logAction("Failed to submit admin request", { error: error.response?.data || error.message });
      }
    }
  });

  const handleNext = () => {
    logAction("Navigating to next step", { step: 1 });
    setStep(2);
  };
  const handleBack = () => {
    logAction("Navigating to previous step", { step: 2 });
    setStep(1);
  };

  // Redirect to home page
  const handleLogoClick = () => {
    navigate('/');  
    logAction("Navigated to home page");
  };

  // Log action helper function
  const logAction = (action, details = {}) => {
    console.log(`Action: ${action}`, details);
    // Here, you could send this log to a remote server or an analytics service if needed
  };

  return (
    <>
      {/* <UserNavbar /> */}
      <div className="form-container">
        {/* Logo with dark background */}
        <div className="header">
          <img
            src={logo}
            alt="Company Logo"
            className="logo"
            onClick={handleLogoClick}
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
                  <PhoneInput
                    id="mobile_no"
                    name="mobile_no"
                    value={formik.values.mobile_no}
                    onChange={(value) => formik.setFieldValue("mobile_no", value)}  // Update the Formik state with the correct value
                    onBlur={formik.handleBlur}
                    className="form-input"
                    defaultCountry="IN" // Default country code is set to India (+91)
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
