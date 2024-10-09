// SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import '../styles/AuthStyles.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    const isLoggedIn = await login(email, password);

    if (isLoggedIn) {
      // After successful login, redirect to dashboard
      navigate('/dashboard', { state: { notification: 'You have successfully logged in!' } });
    } else {
      setError('Invalid email or password');
    }
  };

  const handleHomeRedirect = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-start mb-4">
        <button className="btn btn-primary" onClick={handleHomeRedirect}>
          Home
        </button>
      </div>

      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
