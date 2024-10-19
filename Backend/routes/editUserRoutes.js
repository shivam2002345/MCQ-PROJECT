// routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/editUserController');

// Route to get all users
router.get('/users', UserController.getAllUsers);

// Route to update allowed_count for a specific user
router.put('/users/:user_id/allowed_count', UserController.updateAllowedCount);

module.exports = router;
