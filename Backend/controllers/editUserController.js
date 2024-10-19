// controllers/UserController.js
const User = require('../models/editUserModel');

// Fetch all users (Optional, for admin display)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update allowed_count for a specific user
const updateAllowedCount = async (req, res) => {
  const { user_id } = req.params;
  const { allowed_count } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed_count
    user.allowed_count = allowed_count;
    await user.save();

    res.status(200).json({ message: 'Allowed count updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  updateAllowedCount,
};
