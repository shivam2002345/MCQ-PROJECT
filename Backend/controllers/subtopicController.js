// controllers/subtopicController.js
const subtopicModel = require('../models/subtopicModel');

// Get all subtopics by tech_id
const getSubtopicsByTechId = async (req, res) => {
  const { tech_id } = req.params;

  try {
    const subtopics = await subtopicModel.getSubtopicsByTechId(tech_id);
    res.status(200).json(subtopics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new subtopic
const createSubtopic = async (req, res) => {
  const { tech_id, subtopic_name } = req.body;

  // Validate inputs
  if (!tech_id || !subtopic_name) {
    return res.status(400).json({ error: 'tech_id and subtopic_name are required' });
  }

  try {
    // Check for duplicate subtopic_name under the same tech_id
    const existingSubtopic = await subtopicModel.getSubtopicByNameAndTechId(subtopic_name, tech_id);
    if (existingSubtopic) {
      return res.status(409).json({ error: 'Subtopic with the same name already exists under this tech_id' });
    }

    const newSubtopic = await subtopicModel.createSubtopic(tech_id, subtopic_name);
    res.status(201).json(newSubtopic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing subtopic
const updateSubtopic = async (req, res) => {
  const { subtopic_id } = req.params;
  const { subtopic_name } = req.body;

  // Validate inputs
  if (!subtopic_name) {
    return res.status(400).json({ error: 'subtopic_name is required' });
  }

  try {
    // Check if the subtopic exists
    const existingSubtopic = await subtopicModel.getSubtopicById(subtopic_id);
    if (!existingSubtopic) {
      return res.status(404).json({ error: 'Subtopic not found' });
    }

    // Check for duplicate subtopic_name under the same tech_id
    const duplicateSubtopic = await subtopicModel.getSubtopicByNameAndTechId(subtopic_name, existingSubtopic.tech_id);
    if (duplicateSubtopic && duplicateSubtopic.subtopic_id !== subtopic_id) {
      return res.status(409).json({ error: 'Another subtopic with the same name exists under this tech_id' });
    }

    const updatedSubtopic = await subtopicModel.updateSubtopic(subtopic_id, subtopic_name);
    res.status(200).json(updatedSubtopic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a subtopic
const deleteSubtopic = async (req, res) => {
  const { subtopic_id } = req.params;

  try {
    const deletedSubtopic = await subtopicModel.deleteSubtopic(subtopic_id);
    if (!deletedSubtopic) {
      return res.status(404).json({ error: 'Subtopic not found' });
    }
    res.status(200).json({ message: 'Subtopic deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getSubtopicsByTechId,
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
};