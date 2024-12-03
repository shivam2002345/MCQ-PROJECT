// routes/adminRoutes.js

const express = require('express');
const { getAllAdmins,getAdminById } = require('../controllers/Admin');
const router = express.Router();

// Route to fetch all admins
router.get('/admins', getAllAdmins);
router.get('/admins/:adminId', getAdminById);

module.exports = router;
