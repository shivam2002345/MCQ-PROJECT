// controllers/examController.js

const HostedExam = require('../models/fetchHostedExam');

const getExamsByAdmin = async (req, res) => {
  const adminId = req.params.adminId;  // Expecting adminId as URL parameter

  try {
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Fetch exams associated with the given admin_id
    const exams = await HostedExam.findAll({
      where: {
        admin_id: adminId,
      },
      attributes: [
        'exam_id', 'user_id', 'technology', 'num_questions', 'duration', 'questions', 'exam_link', 'created_at', 'updated_at', 'admin_id'
      ],
    });

    if (exams.length === 0) {
      return res.status(404).json({ message: "No exams found for this admin" });
    }

    res.status(200).json({ exams });
  } catch (error) {
    console.error("Error fetching exams for admin:", error);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
};

module.exports = {
  getExamsByAdmin,
};
