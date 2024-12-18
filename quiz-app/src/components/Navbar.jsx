import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import logo from "../assets/logo.png"; // Update with your logo path
import {
  FaHome,
  FaUserCircle,
  FaRegFileAlt,
  FaRegBell,
  FaSignOutAlt,
  FaSun, FaUserPlus, FaSignInAlt,
  FaMoon,
} from "react-icons/fa"; // FontAwesome icons
import { MdDashboard } from "react-icons/md"; // For dashboard
import { AiOutlineUnorderedList } from "react-icons/ai"; // For requests
import { IoIosSchool } from "react-icons/io"; // For exam access
import "./UserNavbar.css";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className={`user-navbar-container-${theme} sticky-top container-fluid`}>
      <nav className="navbar">
        <Link className="user-navbar-brand" to="/">
          <img src={logo} alt="Website Logo" />
        </Link>

        <ul className="user-navbar-nav">
          <li className="user-nav-item">
            <Link className="user-nav-link" to="/">
              <FaHome className="user-nav-icon" />
              <span>Home</span>
            </Link>
          </li>
          <li className="user-nav-item">
            <Link className="user-nav-link" to="/test-instructions">
              <FaRegFileAlt className="user-nav-icon" />
              <span>Test Instructions</span>
            </Link>
          </li>

          {isAuthenticated() ? (
            <>
              <li className="user-nav-item">
                <Link className="user-nav-link" to="/dashboard">
                  <MdDashboard className="user-nav-icon" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="user-nav-item">
                <Link className="user-nav-link" to="/request">
                  <AiOutlineUnorderedList className="user-nav-icon" />
                  <span>Request Admin</span>
                </Link>
              </li>
              <li className="user-nav-item">
                <Link className="user-nav-link" to="/exam">
                  <IoIosSchool className="user-nav-icon" />
                  <span>Access Exam</span>
                </Link>
               
              </li>
              <li className="user-nav-item">
                <Link className="user-nav-link" to="/resultof-customexam">
                  <IoIosSchool className="user-nav-icon" />
                  <span>Result of Custom Exams</span>
                </Link>
              </li>
              <li className="user-nav-item">
                <Link className="user-nav-link" to="/notifications">
                  <FaRegBell className="user-nav-icon" />
                  <span>Notifications</span>
                </Link>
              </li>
              <li className="user-nav-item">
                <button className="user-btn-outline-danger" onClick={handleLogout}>
                  <FaSignOutAlt className="user-nav-icon" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="user-nav-item">
                <Link className="user-nav-link" to="/signup">
                  <FaUserPlus className="user-nav-icon" />
                  <span>Sign Up</span>
                </Link>
              </li>
              <li className="user-nav-item">
                <Link className="user-nav-link" to="/signin">
                  <FaSignInAlt className="user-nav-icon" />
                  <span>Log In</span>
                </Link>
              </li>
            </>
          )}
        </ul>
        <button className="theme-toggle-btn" onClick={handleThemeToggle}>
          {theme === "light" ? (
            <FaMoon className="theme-icon" />
          ) : (
            <FaSun className="theme-icon" />
          )}
        </button>
      </nav>
    </div>
  );
};

export default UserNavbar;
