const examModel = require('../models/examStatus');

module.exports = {
  // Controller function to update exam status
  changeExamStatus: async (req, res) => {
    const { exam_id } = req.params;  // Get the exam_id from the URL

    try {
      if (!exam_id) {
        return res.status(400).json({
          success: false,
          message: 'Exam ID is required.',
        });
      }

      // Call the model function to update the status
      const updatedExam = await examModel.updateExamStatus(exam_id);

      res.status(200).json({
        success: true,
        message: 'Exam status updated successfully.',
        data: updatedExam,  // Return the updated exam data
      });
    } catch (error) {
      console.error('Error in changing exam status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update exam status.',
        error: error.message,
      });
    }
  },
};
