const examModel = require('../models/examModel');

const createExam = async (user_id, level_id, tech_id) => {
  try {
    // Log parameters for debugging
    console.log('Creating exam with:', { user_id, level_id, tech_id });

    const newExam = await examModel.createExam(user_id, level_id, tech_id);

    console.log('Exam created successfully:', newExam); // Log the created exam
    return newExam;
  } catch (error) {
    console.error('Error in examService.createExam:', error);
    throw new Error('Failed to create exam'); // Throw a new error with context
  }
};

// Fetch exam questions based on exam_id
const getExamQuestions = async (exam_id) => {
  try {
    // Implement fetching logic, ensuring exam_id is valid
    if (!exam_id) {
      throw new Error('Invalid exam ID');
    }

    const questions = await examModel.getQuestionsByExamId(exam_id); // Example function call
    return questions;
  } catch (error) {
    console.error('Error in examService.getExamQuestions:', error);
    throw new Error('Failed to retrieve exam questions');
  }
};

module.exports = { createExam, getExamQuestions };
