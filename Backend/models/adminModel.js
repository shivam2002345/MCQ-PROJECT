const bcrypt = require('bcrypt');

// Admin credentials stored in-memory (In production, this should be a database)
const adminCredentials = [
    {
        email: 'admin@cyberinfomines.com',
        password: '$2b$10$1EVnwwU1xzgkcVfzInEoMeHI1peaT25gFHRDNMOmQ.4.mhRSL/R3y' // Already hashed password
    },
    {
        email: 'admin2@cyberinfomines.com',
        password: '$2b$10$4h6PEp8SGwQ8hr.pBNZ4dO3gDsWla.jj2/o6FqRG6XpT/pEs3SwlO' // Hashed form of "adminPassword2"
    }
];

// Function to find admin by email
const findAdminByEmail = (email) => {
    return adminCredentials.find(admin => admin.email === email);
};

// Function to verify password
const verifyPassword = async (enteredPassword, storedHashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
};

module.exports = { findAdminByEmail, verifyPassword };

