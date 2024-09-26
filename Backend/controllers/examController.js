const pool = require('../config/db');  // Import the pool here
const examService = require('../services/examService');


const examController = {
  async createExam(req, res) {
    const { user_id, level_id, tech_id } = req.body;
    try {
      console.log('Creating exam with:', { user_id, level_id, tech_id });

      // Step 1: Create the exam record
      const newExam = await examService.createExam(user_id, level_id, tech_id);
      console.log('New exam created:', newExam);

      const exam_id = newExam.exam_id;

      // Step 2: Select 5 random questions based on tech_id and level_id
      const selectedQuestions = await pool.query(
        'SELECT question_id FROM questions WHERE tech_id = $1 AND level_id = $2 ORDER BY random() LIMIT 5',
        [tech_id, level_id]
      );
      console.log('Selected questions:', selectedQuestions.rows);

      // Check if questions were found
      if (selectedQuestions.rows.length === 0) {
        console.log('No questions found for the given tech_id and level_id');
        return res.status(404).json({ message: 'No questions found' });
      }

      // Step 3: Insert the selected questions into the exam_questions table
      const insertQuestionsQuery = 'INSERT INTO exam_questions (exam_id, question_id) VALUES ($1, $2)';
      for (const question of selectedQuestions.rows) {
        console.log('Inserting question:', question.question_id);
        await pool.query(insertQuestionsQuery, [exam_id, question.question_id]);
      }

      res.status(201).json({ message: 'Exam created with selected questions', exam_id });
    } catch (err) {
      console.error('Error in createExam:', err.message);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  async getExamQuestions(req, res) {
    const { exam_id } = req.params;
    try {
      console.log('Fetching questions for exam_id:', exam_id);

      // Query to fetch questions for the given exam_id, excluding the correct option
      const query = `
        SELECT q.question_id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
        FROM questions q
        JOIN exam_questions eq ON q.question_id = eq.question_id
        WHERE eq.exam_id = $1
      `;
      const result = await pool.query(query, [exam_id]);
      
      console.log('Fetched questions:', result.rows);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error in getExamQuestions:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = examController;