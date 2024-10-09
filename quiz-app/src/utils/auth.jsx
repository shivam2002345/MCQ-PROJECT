// Simulate a backend with localStorage (for now)
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getUserAuthStatus = () => {
  return localStorage.getItem('isLoggedIn') === 'true'; // Example using localStorage
};

// Check if the user session has expired
export const checkLoginExpiration = () => {
  const loginTime = localStorage.getItem('login_time');
  if (loginTime) {
    const now = new Date().getTime();
    const expirationTime = parseInt(loginTime) + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return now > expirationTime; // Returns true if expired
  }
  return false; // If no login time, assume not expired
};

// Login with real token logic (API login)
export const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send credentials
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token; // Get JWT token from response

      // Store login time
      const now = new Date().getTime();
      localStorage.setItem('login_time', now); // Store login time

      // Since we're not getting userId here, just store the email for now.
      localStorage.setItem('token', data.token); // Store JWT token
      localStorage.setItem('user_id', data.user_id); // Store user_id
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      localStorage.setItem('isLoggedIn', 'true'); // Set isLoggedIn to true

      return true; // Login successful!
    } else {
      console.error("Login failed:", data.message); // Log the error message
      return false; // Login failed!
    }
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

// Logout the user
export const logout = () => {
  // Remove current user details
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userId');
  localStorage.removeItem('user_id');
  localStorage.removeItem('auth-token');
  localStorage.removeItem('isLoggedIn'); // Change this line
  localStorage.removeItem('login_time'); // Clear login time
};

// Get current user details
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'));
};