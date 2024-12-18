const pool = require('../config/db'); // Your database connection config
const Joi = require('joi'); // Import Joi for validation
const { getAllTechnologies } = require('../models/technologyModel'); // Correct import

// Joi schema for validating technology inputs
const techSchema = Joi.object({
  tech_name: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Technology name cannot be empty.',
    'string.min': 'Technology name should be at least 3 characters long.',
    'string.max': 'Technology name should be at most 255 characters long.',
  })
});

// Controller to fetch all technologies
const fetchAllTechnologies = async (req, res) => {
    try {
        const technologies = await getAllTechnologies();  // Correct function call
        res.status(200).json(technologies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching technologies', error: error.message });
    }
};

// Add a new technology
const addTechnology = async (req, res) => {
    const { tech_name } = req.body;

    // Validate input
    const { error } = techSchema.validate({ tech_name });
    if (error) {
        return res.status(400).json({ 
            status: "fail",
            message: error.details[0].message 
        });
    }

    try {
        // Check for duplicates
        const checkDuplicate = await pool.query(
            'SELECT * FROM technologies WHERE tech_name = $1',
            [tech_name]
        );
        if (checkDuplicate.rows.length > 0) {
            return res.status(400).json({ 
                status: "fail",
                message: 'Technology already exists',
                duplicate: true
            });
        }

        // Insert the new technology
        const result = await pool.query(
            'INSERT INTO technologies (tech_name) VALUES ($1) RETURNING *',
            [tech_name]
        );
        res.status(201).json({ 
            status: "success",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            status: "error",
            message: 'Server Error'
        });
    }
};


// Update a technology
const updateTechnology = async (req, res) => {
    const { tech_id } = req.params;
    const { tech_name } = req.body;

    // Validate input
    const { error } = techSchema.validate({ tech_name });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Check if the technology exists
        const checkExisting = await pool.query(
            'SELECT * FROM technologies WHERE tech_id = $1',
            [tech_id]
        );
        if (checkExisting.rows.length === 0) {
            return res.status(404).json({ message: 'Technology not found' });
        }

        // Update the technology
        const result = await pool.query(
            'UPDATE technologies SET tech_name = $1 WHERE tech_id = $2 RETURNING *',
            [tech_name, tech_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a technology
const deleteTechnology = async (req, res) => {
    const { tech_id } = req.params;

    try {
        // Check if the technology exists
        const checkExisting = await pool.query(
            'SELECT * FROM technologies WHERE tech_id = $1',
            [tech_id]
        );
        if (checkExisting.rows.length === 0) {
            return res.status(404).json({ message: 'Technology not found' });
        }

        // Delete the technology
        const result = await pool.query(
            'DELETE FROM technologies WHERE tech_id = $1 RETURNING *',
            [tech_id]
        );
        res.json({ message: 'Technology deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { fetchAllTechnologies, addTechnology, updateTechnology, deleteTechnology };
