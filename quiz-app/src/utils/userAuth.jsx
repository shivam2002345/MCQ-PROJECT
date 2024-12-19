// userAuth.js

// Check if the user is authenticated
export const isAuthenticated = () => {
    return localStorage.getItem('user_id') !== null;
  };
  
  // Check if the user session has expired
  export const checkUserLoginExpiration = () => {
    const loginTime = localStorage.getItem('login_time');
    if (loginTime) {
      const now = new Date().getTime();
      const expirationTime = parseInt(loginTime) + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      return now > expirationTime; // Returns true if expired
    }
    return false; // If no login time, assume not expired
  };
  
  // Login function for user
  export const login = async (email, password) => {
    try {
      const response = await fetch('https://mcq-project-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const token = data.token; // Get JWT token from response
        const now = new Date().getTime();
  
        // Store login time and token
        localStorage.setItem('login_time', now);
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('isUserLoggedIn', 'true'); // Store login status
  
        return true; // Login successful
      } else {
        console.error("Login failed:", data.message);
        return false; // Login failed
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  // Logout the user
  export const userLogout = () => {
    // Remove user details
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('login_time'); // Clear login time
    localStorage.removeItem('isUserLoggedIn'); // Clear user login status
  };
  
