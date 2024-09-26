const { getAllLevels } = require('../models/levelModel');

// Controller function to get all levels
const fetchAllLevels = async (req, res) => {
  try {
    const levels = await getAllLevels();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching levels', error: error.message });
  }
};

module.exports = { fetchAllLevels };