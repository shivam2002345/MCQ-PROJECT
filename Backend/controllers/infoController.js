const userModel = require('../models/infomodel');

// Get user details by user_id
const getUserDetails = async (req, res) => {
  const { user_id } = req.params;

  try {
    const userDetails = await userModel.getUserDetailsById(user_id);
    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserDetails };
