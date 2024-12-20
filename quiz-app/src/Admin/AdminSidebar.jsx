import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faQuestionCircle, faListAlt, faUsers, faSignOutAlt, faCogs } from '@fortawesome/free-solid-svg-icons';
import dashboard from '../assets/dashboard.png';
import logAction  from '../utils/logAction';  // Importing logAction

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logAction('Logout', 'Admin logged out');  // Log the logout action
        localStorage.removeItem('adminToken');
        localStorage.removeItem('login_time');
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/');
    };

    return (
        <div className="admin-sidebar">
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/admin/dashboard" className="sidebar-link" activeClassName="active" onClick={() => logAction('Navigation', 'Navigated to Dashboard')}>
                        <img src={dashboard} alt="Dashboard" />
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/csv-upload" className="sidebar-link" activeClassName="active" onClick={() => logAction('Navigation', 'Navigated to CSV Upload')}>
                        <FontAwesomeIcon icon={faFileCsv} className="sidebar-icon" /> Upload Questions
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/questions" className="sidebar-link" activeClassName="active" onClick={() => logAction('Navigation', 'Navigated to Manage Questions')}>
                        <FontAwesomeIcon icon={faQuestionCircle} className="sidebar-icon" /> Manage Questions
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/technology-management" className="sidebar-link" activeClassName="active" onClick={() => logAction('Navigation', 'Navigated to Technology Management')}>
                        <FontAwesomeIcon icon={faCogs} className="sidebar-icon" /> Technology Management
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/users" className="sidebar-link" activeClassName="active" onClick={() => logAction('Navigation', 'Navigated to Total Users')}>
                        <FontAwesomeIcon icon={faUsers} className="sidebar-icon" /> Total Users
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/subtopics" className="sidebar-link" onClick={() => logAction('Navigation', 'Navigated to Manage Subtopics')}>
                        <FontAwesomeIcon icon={faListAlt} className="sidebar-icon" /> Manage Subtopics
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/adminlist" className="sidebar-link" activeClassName="active" onClick={() => logAction('Navigation', 'Navigated to Admin List')}>
                        <FontAwesomeIcon icon={faUsers} className="sidebar-icon" /> Admin List
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/adminrequest" className="sidebar-link" activeClassName="active" onClick={() => logAction('Navigation', 'Navigated to All Requests')}>
                        <FontAwesomeIcon icon={faUsers} className="sidebar-icon" /> All requests
                    </NavLink>
                </li>
                <li>
                    <button onClick={handleLogout} className="sidebar-link logout">
                        <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" /> Signout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
