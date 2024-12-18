const { findAdminByEmail } = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Adjust the path as needed

const JWT_SECRET = 'your_secret_key'; // Use a strong secret key

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await findAdminByEmail(email);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, redirectTo: '/admin/dashboard' });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
};
// Utility function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to validate password strength (at least 8 characters)
function isValidPassword(password) {
    return password && password.length >= 8;
}

// Submit Admin Request
async function submitAdminRequest(req, res) {
    const {
        name,
        email,
        password,
        note,
        organisation_name,
        organisation_address,
        designation,
        mobile_no,
        reason_to_be_admin
    } = req.body;

    // Utility function for mobile number validation
    function isValidMobile(mobileNo) {
        const regex = /^\+\d{1,3}\d{6,12}$/; // Format: +<country_code>-<number>
        return regex.test(mobileNo);
    }

    // Utility function for address validation
    function isValidAddress(address) {
        return address && address.length >= 10; // Simple validation for non-empty and minimum length
    }

    // Validate all required fields
    if (!name || name.length < 3) {
        return res.status(400).json({ error: "Name must be at least 3 characters long." });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ 
            error: "Password must be at least 8 characters long and include a mix of letters, numbers, and symbols." 
        });
    }

    if (!organisation_name || organisation_name.length < 3) {
        return res.status(400).json({ error: "Organisation name must be at least 3 characters long." });
    }

    if (!isValidAddress(organisation_address)) {
        return res.status(400).json({ error: "Organisation address must be at least 10 characters long." });
    }

    if (!designation || designation.length < 2) {
        return res.status(400).json({ error: "Designation must be at least 2 characters long." });
    }

    if (!isValidMobile(mobile_no)) {
        return res.status(400).json({
            error: "Invalid mobile number format. Use format: +<country_code>-<number> (e.g., +91-9876543210)."
        });
    }

    if (!reason_to_be_admin || reason_to_be_admin.length < 10) {
        return res.status(400).json({
            error: "Please provide a reason for becoming an admin, with at least 10 characters."
        });
    }

    try {
        // Check for duplicate email
        const existingAdmin = await db.query(
            `SELECT admin_id FROM admin WHERE email = $1`,
            [email]
        );

        if (existingAdmin.rows.length > 0) {
            return res.status(409).json({ error: "An admin with this email already exists." });
        }

        // Insert new admin with hashed password
        const newAdmin = await db.query(
            `
            INSERT INTO admin (name, email, password, organisation_name, organisation_address, designation, mobile_no, status) 
            VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, $5, $6, $7, 'pending')
            RETURNING admin_id
            `,
            [name, email, password, organisation_name, organisation_address, designation, mobile_no]
        );

        const adminId = newAdmin.rows[0].admin_id;

        // Insert the admin request
        await db.query(
            `
            INSERT INTO adminrequest (user_id, note, status, requested_on) 
            VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP)
            `,
            [adminId, note]
        );

        // Insert notification for the user about the pending request
        await db.query(
            `
            INSERT INTO adminnotification (user_id, message, status) 
            VALUES ($1, 'Your request to become an admin is pending. Please wait for 48 hours.', 'unread')
            `,
            [adminId]
        );

        res.status(200).json({ message: "Admin request submitted successfully." });
    } catch (error) {
        if (error.code === '23505') {
            // Unique constraint violation
            res.status(409).json({
                error: "Duplicate request. The email is already associated with a pending admin request."
            });
        } else {
            console.error("Error submitting admin request:", error);
            res.status(500).json({ error: "An error occurred. Please try again." });
        }
    }
}

// Get all pending admin requests
async function getPendingAdminRequests(req, res) {
    try {
        const result = await db.query('SELECT * FROM AdminRequest WHERE status = $1', ['pending']);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching pending admin requests:", error);
        res.status(500).json({ error: "Unable to fetch admin requests." });
    }
}

// Update the status of an admin request
async function updateAdminRequestStatus(req, res) {
    const { id } = req.params;
    const { status, message } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status value. Must be 'approved' or 'rejected'." });
    }

    try {
        // Update the request status in AdminRequest table
        const updateResult = await db.query(`
            UPDATE AdminRequest 
            SET status = $1 
            WHERE request_id = $2 
            RETURNING user_id
        `, [status, id]);

        // Check if the request was found and updated
        if (updateResult.rows.length === 0) {
            return res.status(404).json({ error: "Request not found." });
        }

        const userId = updateResult.rows[0].user_id;

        // Update the status in Admin table as well (approve/reject the admin status)
        await db.query(`
            UPDATE Admin 
            SET status = $1 
            WHERE admin_id = $2
        `, [status, userId]);

        // Prepare the message for the notification
        let notificationMessage = '';
        if (status === 'approved') {
            notificationMessage = 'Your admin request has been approved.';
        } else if (status === 'rejected') {
            notificationMessage = message || 'Your admin request has been rejected.';
        }

        // Update or insert a new notification message for the user
        const notificationResult = await db.query(`
            UPDATE AdminNotification 
            SET message = $1, status = 'unread' 
            WHERE user_id = $2
            RETURNING notification_id
        `, [notificationMessage, userId]);

        // If no notification was found, insert a new one
        if (notificationResult.rows.length === 0) {
            await db.query(`
                INSERT INTO AdminNotification (user_id, message, status)
                VALUES ($1, $2, 'unread')
            `, [userId, notificationMessage]);
        }

        res.status(200).json({ message: `Request ${status} successfully.` });
    } catch (error) {
        console.error("Error updating admin request status:", error);
        res.status(500).json({ error: "Unable to update request status." });
    }
}


// Get notifications for a user
async function getUserNotifications(req, res) {
    const { user_id } = req.params;

    try {
        const result = await db.query('SELECT * FROM AdminNotification WHERE user_id = $1', [user_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Unable to fetch notifications." });
    }
}

// Mark a notification as read
async function markNotificationAsRead(req, res) {
    const { id } = req.params;

    try {
        await db.query('UPDATE AdminNotification SET status = $1 WHERE notification_id = $2', ['read', id]);
        res.status(200).json({ message: "Notification marked as read." });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ error: "Unable to update notification status." });
    }
}

// New Admin Login
// Admin Login with status check
async function newadminLogin(req, res) {
    const { email, password } = req.body;

    try {
        // Query the database to find the admin by email
        const result = await db.query('SELECT * FROM Admin WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const admin = result.rows[0];

        // Check if the password matches using bcrypt
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Check the status of the admin account
        if (admin.status === 'approved') {
            res.status(200).json({ message: "Login successful", admin });
        } else if (admin.status === 'rejected') {
            res.status(400).json({ error: "Your admin request has been rejected." });
        } else if (admin.status === 'pending') {
            // If the status is pending, show the associated message
            const notificationResult = await db.query(`
                SELECT message FROM AdminNotification 
                WHERE user_id = $1 AND status = 'unread' 
                ORDER BY created_at DESC LIMIT 1
            `, [admin.admin_id]);

            if (notificationResult.rows.length > 0) {
                const message = notificationResult.rows[0].message;
                res.status(400).json({ error: message });
            } else {
                res.status(400).json({ error: "Your admin request is still pending. Please wait for approval." });
            }
        } else {
            res.status(400).json({ error: "Unknown status, please contact support." });
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ error: "An error occurred. Please try again." });
    }
}


module.exports = {
    adminLogin,
    newadminLogin,
    submitAdminRequest,
    getPendingAdminRequests,
    updateAdminRequestStatus,
    getUserNotifications,
    markNotificationAsRead
};