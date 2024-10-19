const { findAdminByEmail } = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key'; // Use a strong secret key

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await findAdminByEmail(email); // Ensure you await this function
    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify the plain-text password against the hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '1h' }); // Adjust expiration as needed

    // Successful login, return token and redirect
    res.status(200).json({ message: 'Login successful', token, redirectTo: '/admin/dashboard' });
};

module.exports = { adminLogin };
