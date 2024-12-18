const {pool} = require('../config/database'); // Import the pool here
const examService = require('../services/examService');

const examController = {
  async createExam(req, res) {
    const { user_id, level_id, tech_id, subtopic_id } = req.body;

    // Input validation
    if (!user_id || !level_id || !tech_id || !subtopic_id) {
      return res.status(400).json({ message: 'Missing required fields: user_id, level_id, tech_id, subtopic_id' });
    }

    try {
      // Step 1: Check current user_count and allowed_count
      const userResult = await pool.query('SELECT user_count, allowed_count FROM users WHERE user_id = $1', [user_id]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Step 2: Check if user has reached their exam limit
      if (user.user_count >= user.allowed_count) {
        return res.status(403).json({ message: 'You have reached your limit of taking exams. Please request admin for more chances.' });
      }

      // Step 3: Increment the user_count by 1
      await pool.query('UPDATE users SET user_count = user_count + 1 WHERE user_id = $1', [user_id]);

      console.log('User count incremented for user_id:', user_id);

      // Step 4: Create the exam record with subtopic_id
      const newExam = await pool.query(
        'INSERT INTO exams (user_id, level_id, tech_id, subtopic_id, exam_date) VALUES ($1, $2, $3, $4, NOW()) RETURNING exam_id',
        [user_id, level_id, tech_id, subtopic_id]
      );
      const exam_id = newExam.rows[0].exam_id;

      // Step 5: Select 25 random questions based on tech_id, level_id, and subtopic_id
      const selectedQuestions = await pool.query(
        'SELECT question_id FROM questions WHERE tech_id = $1 AND level_id = $2 AND subtopic_id = $3 ORDER BY random() LIMIT 25',
        [tech_id, level_id, subtopic_id]
      );

      if (selectedQuestions.rows.length === 0) {
        return res.status(404).json({ message: 'No questions found for the given criteria' });
      }

      // Step 6: Insert the selected questions into the exam_questions table
      const insertQuestionsQuery = 'INSERT INTO exam_questions (exam_id, question_id) VALUES ($1, $2)';
      const insertPromises = selectedQuestions.rows.map(question =>
        pool.query(insertQuestionsQuery, [exam_id, question.question_id])
      );

      await Promise.all(insertPromises); // Insert all questions concurrently

      // Step 7: Respond with success
      res.status(201).json({ message: `Exam created with selected questions for exam_id ${exam_id}`, exam_id });
    } catch (err) {
      console.error('Error in createExam:', err.message);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  async getExamQuestions(req, res) {
    const { exam_id } = req.params;

    try {
      console.log('Fetching questions for exam_id:', exam_id);

      // Query to fetch questions for the given exam_id, including the correct option
      const query = `
        SELECT q.question_id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option
        FROM questions q
        JOIN exam_questions eq ON q.question_id = eq.question_id
        WHERE eq.exam_id = $1
      `;
      const result = await pool.query(query, [exam_id]);

      if (result.rows.length === 0) {
        console.log('No questions found for the given exam_id');
        return res.status(404).json({ message: 'No questions found for this exam' });
      }

      console.log('Fetched questions:', result.rows);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error in getExamQuestions:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async completeExam(req, res) {
    const { user_id } = req.body; // Get the user_id from the request body

    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id' });
    }

    try {
      // Step 1: Increment user_count
      const updateResult = await pool.query(
        'UPDATE users SET user_count = user_count + 1 WHERE user_id = $1',
        [user_id]
      );

      // Check if the update was successful
      if (updateResult.rowCount === 0) {
        return res.status(404).json({ message: 'User not found or update failed' });
      }

      // Step 2: Check current user_count and allowed_count
      const result = await pool.query('SELECT user_count, allowed_count FROM users WHERE user_id = $1', [user_id]);
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Step 3: Check if user_count equals allowed_count
      if (user.user_count >= user.allowed_count) {
        return res.status(403).json({ message: 'You have reached your limit of taking exams. Please request admin for more chances.' });
      }

      // Step 4: Proceed with any other logic (if necessary) after exam completion
      res.status(200).json({ message: 'Exam completed successfully', user_count: user.user_count });
    } catch (error) {
      console.error('Error in completeExam:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = examController;
