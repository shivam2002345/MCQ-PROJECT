const userModel = require('../models/userModel');

// Controller to get all users' names and emails
const getUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users); // Send the list of users as a JSON response
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getUsers,
};