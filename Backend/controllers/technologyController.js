const { getAllTechnologies } = require('../models/technologyModel');

// Controller to fetch all technologies
const fetchAllTechnologies = async (req, res) => {
    try {
        const technologies = await getAllTechnologies();
        res.status(200).json(technologies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching technologies', error: error.message });
    }
};

module.exports = { fetchAllTechnologies };