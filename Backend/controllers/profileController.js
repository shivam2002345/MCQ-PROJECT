const User = require('../models/userModel');
const Result = require('../models/resultModel');

// Get user profile and test history
const getUserProfile = async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Fetch user profile along with test history (with exam_id)
    const testHistory = await Result.getTestHistoryByUserId(userId);
    
    // Fetch results only by user_id (excluding exam_id details)
    const resultsByUser = await Result.getResultsByUserId(userId);

    if (testHistory.length === 0 && resultsByUser.length === 0) {
      return res.status(200).json({ message: 'No history available. After giving an exam, you will be able to view your history.' });
    }

    // Extract user details from the first record
    const userProfile = {
      name: testHistory.length > 0 ? testHistory[0].user_name : 'N/A',
      email: testHistory.length > 0 ? testHistory[0].email : 'N/A',
      exams: testHistory.map(exam => ({
        exam_id: exam.exam_id,
        result_id: exam.result_id,
        technology: exam.technology,
        level: exam.level,
        score: exam.score,
        total_questions: exam.total_questions,
        exam_date: exam.exam_date
      })),
      resultsByUser: resultsByUser.map(result => ({
        result_id: result.result_id,
        exam_id: result.exam_id,  // Include exam_id, since we are fetching it from `results` table
        score: result.score,
        total_questions: result.total_questions,
        result_date: result.result_date
      }))
    };

    // Return the user profile and test history
    res.json(userProfile);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUserProfile };
