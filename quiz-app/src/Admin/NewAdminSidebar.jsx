import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./StableAdminSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const StableAdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("adminToken");
    localStorage.removeItem("login_time"); // Clear login time
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };

  return (
    <div className="stable-sidebar">
      <ul className="stable-menu">
        <li>
          <NavLink
            to="/newadmin/oldusers"
            className="stable-link"
            activeClassName="stable-active"
          >
            <FontAwesomeIcon icon={faUsers} className="stable-icon" /> Total
            Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/newadmin/hostexamfornewuser"
            className="stable-link"
            activeClassName="stable-active"
          >
            <FontAwesomeIcon icon={faUsers} className="stable-icon" /> Host Exam
            for New User
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/newadmin/examlist"
            className="stable-link"
            activeClassName="stable-active"
          >
            <FontAwesomeIcon icon={faUsers} className="stable-icon" /> Total
            Hosted Exams
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="stable-link stable-logout">
            <FontAwesomeIcon icon={faSignOutAlt} className="stable-icon" />{" "}
            Signout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default StableAdminSidebar;
