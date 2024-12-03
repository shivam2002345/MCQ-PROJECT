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
  const { tech_id } = req.body;
  const { subtopic_name } = req.body;

  try {
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

  try {
    const updatedSubtopic = await subtopicModel.updateSubtopic(subtopic_id, subtopic_name);
    if (!updatedSubtopic) {
      return res.status(404).json({ error: 'Subtopic not found' });
    }
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
