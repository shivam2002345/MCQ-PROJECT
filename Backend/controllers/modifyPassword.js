const bcrypt = require('bcryptjs'); // Import bcryptjs
const User = require('../models/modifyPassword'); // Assuming Sequelize or similar ORM is used

// Update Password Controller
exports.updatePassword = async (req, res) => {
  const { user_id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    // Fetch user by ID
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password using bcryptjs
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
};
