// models/subtopicModel.js
const {pool} = require('../config/database');

// Get all subtopics for a given tech_id
const getSubtopicsByTechId = async (tech_id) => {
  const query = 'SELECT * FROM subtopics WHERE tech_id = $1';
  const { rows } = await pool.query(query, [tech_id]);
  return rows;
};

// Create a new subtopic
const createSubtopic = async (tech_id, subtopic_name) => {
  const query = 'INSERT INTO subtopics (tech_id, subtopic_name) VALUES ($1, $2) RETURNING *';
  const { rows } = await pool.query(query, [tech_id, subtopic_name]);
  return rows[0];
};

// Update an existing subtopic by subtopic_id
const updateSubtopic = async (subtopic_id, subtopic_name) => {
  const query = 'UPDATE subtopics SET subtopic_name = $1 WHERE subtopic_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [subtopic_name, subtopic_id]);
  return rows[0];
};

// Delete a subtopic by subtopic_id
const deleteSubtopic = async (subtopic_id) => {
  const query = 'DELETE FROM subtopics WHERE subtopic_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [subtopic_id]);
  return rows[0];
};

module.exports = {
  getSubtopicsByTechId,
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
};
