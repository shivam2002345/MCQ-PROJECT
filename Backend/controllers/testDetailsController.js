const testDetailsModel = require('../models/testDetailsModel');

// Get result by result_id
const getResultByResultId = async (req, res) => {
    const { result_id } = req.params;
  
    try {
      const result = await testDetailsModel.getResultById(result_id);
  
      if (!result) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      const incorrect_answers = result.total_questions - result.correct_answers;
  
      let parsedSelectedAnswers;
      try {
        // If it's a string, parse it; otherwise, it's already an array/object.
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
        selected_answers: parsedSelectedAnswers // Return parsed selected_answers
      });
    } catch (err) {
      console.error('Error fetching result:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

module.exports = { getResultByResultId };
