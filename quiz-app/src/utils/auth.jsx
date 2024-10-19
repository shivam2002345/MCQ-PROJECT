// Check if the user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('isUserLoggedIn') !== null;
};

// Check if the admin is authenticated
export const isAdminAuthenticated = () => {
  return localStorage.getItem('adminToken') !== null;
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

      // Store user token
      localStorage.setItem('token', token); // Store JWT token
      localStorage.setItem('user_id', data.user_id); // Store user_id
      localStorage.setItem('isUserLoggedIn', 'true'); // Set isUserLoggedIn to true

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

// Admin login function (use `adminToken`)
export const adminLogin = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send admin credentials
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token; // Get admin JWT token

      // Store login time
      const now = new Date().getTime();
      localStorage.setItem('login_time', now); // Store login time

      // Store admin token
      localStorage.setItem('adminToken', token); // Store admin JWT token
      localStorage.setItem('isAdminLoggedIn', 'true'); // Set isAdminLoggedIn to true

      return true; // Admin login successful!
    } else {
      console.error("Admin login failed:", data.message); // Log the error message
      return false; // Login failed!
    }
  } catch (error) {
    console.error('Admin login failed:', error);
    return false;
  }
};

// Logout the user or admin
export const logout = () => {
  // Remove user and admin details
  localStorage.removeItem('token');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('user_id');
  localStorage.removeItem('login_time'); // Clear login time
  localStorage.removeItem('isUserLoggedIn'); // Clear user login status
  localStorage.removeItem('isAdminLoggedIn'); // Clear admin login status
};

// Get current user details
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'));
};
