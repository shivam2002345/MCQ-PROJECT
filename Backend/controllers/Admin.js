// controllers/adminController.js

const Admin = require('../models/Admin');

// Fetch all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getAdminById = async (req, res) => {
  const { adminId } = req.params;
  try {
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById
};
