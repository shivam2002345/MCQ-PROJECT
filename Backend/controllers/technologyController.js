const pool = require('../config/db'); // Your database connection config

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

// Add a new technology
const addTechnology = async (req, res) => {
    const { tech_name } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO technologies (tech_name) VALUES ($1) RETURNING *',
        [tech_name]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  // Update a technology
  const updateTechnology = async (req, res) => {
    const { tech_id } = req.params;
    const { tech_name } = req.body;
    try {
      const result = await pool.query(
        'UPDATE technologies SET tech_name = $1 WHERE tech_id = $2 RETURNING *',
        [tech_name, tech_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Technology not found' });
      }
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
      const result = await pool.query(
        'DELETE FROM technologies WHERE tech_id = $1 RETURNING *',
        [tech_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Technology not found' });
      }
      res.json({ message: 'Technology deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

module.exports = { fetchAllTechnologies ,addTechnology ,updateTechnology ,deleteTechnology};