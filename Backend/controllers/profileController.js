const User = require('../models/userModel');
const Result = require('../models/resultModel');

// Get user profile and test history
const getUserProfile = async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Fetch user profile along with test history
    const testHistory = await Result.getTestHistoryByUserId(userId);

    if (testHistory.length === 0) {
      return res.status(404).json({ error: 'User or exam data not found' });
    }

    // Extract user details from the first record
    const userProfile = {
      name: testHistory[0].user_name,
      email: testHistory[0].email,
      exams: testHistory.map(exam => ({
        exam_id: exam.exam_id,
        result_id: exam.result_id,
        technology: exam.technology,
        level: exam.level,
        score: exam.score,
        total_questions: exam.total_questions,
        exam_date: exam.exam_date
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
