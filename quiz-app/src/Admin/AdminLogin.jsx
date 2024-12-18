import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logAction  from '../utils/logAction'; // Adjust the path as needed
import './AdminLogin.css'; // Import the CSS file for styling
import logo from '../assets/logo.png'; // Import your logo image

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        logAction('INFO', 'Attempting admin login'); // Log when login attempt starts

        try {
            const response = await axios.post('http://localhost:8080/admin/login', {
                email,
                password,
            });

            // Store token in local storage
            localStorage.setItem('adminToken', response.data.token);

            // Log successful login
            logAction('INFO', `Admin logged in successfully with email: ${email}`);

            // Redirect to the dashboard
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
            logAction('ERROR', `Login failed for email: ${email}`); // Log failed login
        }
    };

    const handleLogoClick = () => {
        logAction('INFO', 'Logo clicked, navigating to home'); // Log when logo is clicked
        navigate('/');
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="logo-container">
                    <img
                        src={logo}
                        alt="CyberInfoMines Logo"
                        className="logo"
                        onClick={handleLogoClick}
                    />
                </div>
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="login-btn" type="submit">Login</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;
