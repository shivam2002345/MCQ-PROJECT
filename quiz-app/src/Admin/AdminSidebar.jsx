import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminSidebar.css'; // Ensure this CSS file is correctly imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faQuestionCircle, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importing relevant icons
import dashboard from '../assets/dashboard.png'
const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        localStorage.removeItem('login_time'); // Clear login time
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/');
    };

    return (
        <div className="admin-sidebar">
            <ul className="sidebar-menu">
            <li>
                    <Link to="/admin/dashboard" className="sidebar-link">
                    <img src={dashboard} alt="Dashboard" />
                    
                    </Link>
                </li>
                <li>
                    <Link to="/admin/csv-upload" className="sidebar-link">
                        <FontAwesomeIcon icon={faFileCsv} className="sidebar-icon" />Upload Questions
                    </Link>
                </li>
                <li>
                    <Link to="/admin/questions" className="sidebar-link">
                        <FontAwesomeIcon icon={faQuestionCircle} className="sidebar-icon" />Manage Questions
                    </Link>
                </li>
                <li>
                    <Link to="/admin/users" className="sidebar-link">
                        <FontAwesomeIcon icon={faUsers} className="sidebar-icon" /> Total Users
                    </Link>
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
