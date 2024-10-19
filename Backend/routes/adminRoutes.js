const express = require('express');
const { adminLogin } = require('../controllers/adminController');

const router = express.Router();

// Define the admin login route
router.post('/login', adminLogin);

module.exports = router;