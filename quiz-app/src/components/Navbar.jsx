import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth';
import logo from '../assets/logo.png'; // Add your logo path
import '../styles/Navbar.css'; // Import the custom CSS file

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="CyberInfoMines Logo" className="navbar-logo" />
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated() ? (
              <li className="nav-item">
                <button className="btn btn-outline-danger custom-button" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
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
  );
};

export default Navbar;
