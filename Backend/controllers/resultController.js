const resultModel = require('../models/resultModel');

// Create a new result for the exam
const createResult = async (req, res) => {
  const { exam_id, user_id, total_questions, correct_answers, score, selected_answers } = req.body;

  try {
    const newResult = await resultModel.createResult(
      exam_id,
      user_id,
      total_questions,
      correct_answers,
      score,
      JSON.stringify(selected_answers)
    );
    res.status(201).json({ message: 'Result created successfully', result: newResult });
  } catch (err) {
    console.error('Error creating result:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get result by exam_id and user_id
const getResultByExamAndUser = async (req, res) => {
  const { exam_id, user_id } = req.params;

  try {
    const result = await resultModel.getResultByExamAndUser(exam_id, user_id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    const incorrect_answers = result.total_questions - result.correct_answers;

    let parsedSelectedAnswers;
    try {
      // Check if selected_answers is already a valid JSON string
      if (typeof result.selected_answers === 'string') {
        parsedSelectedAnswers = JSON.parse(result.selected_answers);
      } else {
        parsedSelectedAnswers = result.selected_answers;
      }
    } catch (parseError) {
      console.error('Error parsing selected_answers:', parseError);
      return res.status(500).json({ message: 'Error parsing selected_answers', error: parseError.message });
    }

    res.status(200).json({
      exam_id: result.exam_id,
      user_id: result.user_id,
      total_questions: result.total_questions,
      correct_answers: result.correct_answers,
      incorrect_answers,
      score: result.score,
      selected_answers: parsedSelectedAnswers, // Return parsed selected_answers
    });
  } catch (err) {
    console.error('Error fetching result:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createResult, getResultByExamAndUser };

module.exports = { createResult, getResultByExamAndUser };
