const resultModel = require('../models/resultModel');

// Create a new result for the exam
const createResult = async (req, res) => {
  const { exam_id, user_id, total_questions, correct_answers, score, selected_answers } = req.body;

  try {
    // Insert the result into the database
    const newResult = await resultModel.createResult(exam_id, user_id, total_questions, correct_answers, score, selected_answers);
    res.status(201).json({ message: 'Result created successfully', result: newResult });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Fetch result for an exam and user
const getResult = async (req, res) => {
    const { exam_id, user_id } = req.params;
  
    try {
      // Get the result from the database
      const result = await resultModel.getResultByExamAndUser(exam_id, user_id);
  
      if (!result) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      // Calculate the incorrect answers
      const incorrect_answers = result.total_questions - result.correct_answers;
  
      res.status(200).json({
        exam_id: result.exam_id,
        user_id: result.user_id,
        total_questions: result.total_questions,
        correct_answers: result.correct_answers,
        incorrect_answers: incorrect_answers,
        score: result.score,
        selected_answers: result.selected_answers
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
module.exports = { createResult , getResult };
