const { getQuestions, getTechnologies, getLevels, deleteQuestion, updateQuestion } = require('../models/filterquestonModel');

// Fetch questions based on filters
const fetchQuestions = async (req, res) => {
  try {
    const { tech_id, level_id } = req.query;
    const questions = await getQuestions(tech_id, level_id);

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Fetch technologies
const fetchTechnologies = async (req, res) => {
  try {
    const technologies = await getTechnologies();
    res.status(200).json(technologies);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Fetch levels
const fetchLevels = async (req, res) => {
  try {
    const levels = await getLevels();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a question
const handleDeleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await deleteQuestion(id);

    if (!deletedQuestion) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    res.status(200).json({ success: true, data: deletedQuestion });
  } catch (error) {
    console.error('Error deleting question:', error); // Log the error to the console
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update a question
// Update a question
const handleUpdateQuestion = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Ensure all fields are being passed in the request body
      const {
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
      } = req.body;
  
      // Call the model function to update the question
      const updatedQuestion = await updateQuestion(id, {
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
      });
  
      if (!updatedQuestion) {
        return res.status(404).json({ success: false, message: 'Question not found.' });
      }
  
      // Log the question_id of the updated question
      console.log(`Question with ID ${updatedQuestion.question_id} updated successfully.`);
  
      res.status(200).json({ success: true, data: updatedQuestion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  

module.exports = {
  fetchQuestions,
  fetchTechnologies,
  fetchLevels,
  handleDeleteQuestion,
  handleUpdateQuestion,
};