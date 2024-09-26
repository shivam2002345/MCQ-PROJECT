const examModel = require('../models/examModel');

const createExam = async (user_id, level_id, tech_id) => {
  try {
    return await examModel.createExam(user_id, level_id, tech_id);
  } catch (error) {
    console.error('Error in examService.createExam:', error);
    throw error;
  }
};

const getExamQuestions = async (exam_id) => {
  // Implement this function if needed
};

module.exports = { createExam, getExamQuestions };