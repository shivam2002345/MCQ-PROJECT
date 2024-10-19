import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Check if the admin is authenticated
export const isAdminAuthenticated = () => {
  return localStorage.getItem('adminToken') !== null;
};

// Check if the admin session has expired
// export const checkAdminLoginExpiration = () => {
//   const loginTime = localStorage.getItem('login_time');
//   if (loginTime) {
//     const now = new Date().getTime();
//     const expirationTime = parseInt(loginTime) + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
//     return now > expirationTime; // Returns true if expired
//   }
//   return false; // If no login time, assume not expired
// };


// Logout the admin
export const adminLogout = () => {
  // Remove admin details
  localStorage.removeItem('adminToken');
  localStorage.removeItem('login_time'); // Clear login time
  localStorage.removeItem('isAdminLoggedIn'); // Clear login status
};



