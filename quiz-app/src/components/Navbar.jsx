import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import logo from "../assets/logo.png"; // Add your logo path here
import {
  FaHome,
  FaUser,
  FaInfoCircle,
  FaUserShield,
  FaBell,
  FaSignOutAlt
} from "react-icons/fa"; // FontAwesome icons
import "./UserNavbar.css";

const UserNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="user-navbar-container-fluid sticky-top  container-fluid">
    <nav className="navbar">
      <Link className="user-navbar-brand" to="/">
        <img src={logo} alt="Website Logo" />
      </Link>

      <ul className="user-navbar-nav">
        <li className="user-nav-item">
          <Link className="user-nav-link" to="/">
            <FaHome className="user-nav-icon" /> Home
          </Link>
        </li>
        <li className="user-nav-item">
          <Link className="user-nav-link" to="/test-instructions">
            <FaInfoCircle className="user-nav-icon" /> Test Instructions
          </Link>
        </li>

        {isAuthenticated() ? (
          <>
            <li className="user-nav-item">
              <Link className="user-nav-link" to="/dashboard">
                <FaUser className="user-nav-icon" /> Dashboard
              </Link>
            </li>
            <li className="user-nav-item">
              <Link className="user-nav-link" to="/request">
                <FaInfoCircle className="user-nav-icon" /> Request Admin
              </Link>
            </li>
            <li className="user-nav-item">
              <Link className="user-nav-link" to="/notifications">
                <FaBell className="user-nav-icon" /> Notifications
              </Link>
            </li>
            <li className="user-nav-item">
              <button
                className="user-btn-outline-danger"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="user-nav-icon" /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="user-nav-item">
              <Link className="user-nav-link" to="/admin/login">
                <FaUserShield className="user-nav-icon" /> Admin Panel
              </Link>
            </li>
            <li className="user-nav-item">
              <Link className="user-nav-link" to="/signup">
                Sign Up
              </Link>
            </li>
            <li className="user-nav-item">
              <Link className="user-nav-link" to="/signin">
                Log In
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  </div>
  );
};

export default UserNavbar;
