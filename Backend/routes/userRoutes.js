const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

// Route to get all users
router.get('/users', userController.getUsers);

module.exports = router;