import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth';
import logo from '../assets/logo.png'; // Add your logo path
// import '../styles/Navbar.css';
import { FaHome, FaUser, FaInfoCircle } from 'react-icons/fa'; // FontAwesome icons (Home, User, and Info for Test Instructions)
import './Navbar.css'
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="container-fluid">
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="CyberInfoMines Logo" className="navbar-logo" />
        </Link>

        {/* Collapsible Navbar */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {/* Home Icon - Always Visible */}
            <li className="nav-item">
              <Link className="nav-link custom-button" to="/">
                <FaHome className="me-1" /> Home
              </Link>
            </li>

            {/* Test Instructions - Always Visible */}
            <li className="nav-item">
              <Link className="nav-link custom-button" to="/test-instructions">
                <FaInfoCircle className="me-1" /> Test Instructions
              </Link>
            </li>

            {isAuthenticated() ? (
              <>
                {/* Dashboard/Profile Icon - Visible when logged in */}
                <li className="nav-item">
                  <Link className="nav-link custom-button" to="/dashboard">
                    <FaUser className="me-1" /> Dashboard
                  </Link>
                </li>

                {/* Logout Button */}
                <li className="nav-item">
                  <button className="btn btn-outline-danger custom-button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Sign Up and Log In - Visible when not logged in */}
                <li className="nav-item">
                  <Link className="nav-link custom-button" to="/signup">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-button" to="/signin">Log In</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
