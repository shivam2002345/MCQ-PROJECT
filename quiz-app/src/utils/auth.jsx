// Simulate a backend with localStorage (for now)
export const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
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
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify({ email })); // Store user data
      return true;
    } else {
      return false; // Invalid login
    }
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

// Logout the user
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser'); // Remove current user details
};

// Get current user details
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'));
};
