const hostedresult = require('../models/hostedresult');  // Ensure your model is correctly set up for 'exam_results'

module.exports = {
  saveResult: async (req, res) => {
    try {
      console.log('Received payload:', req.body); // Log the incoming payload
      const resultData = req.body;
      const savedResult = await hostedresult.saveResult(resultData);
      res.status(201).json({
        success: true,
        message: 'Result saved successfully.',
        data: savedResult,
      });
    } catch (error) {
      console.error('Error saving result:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save result.',
        error: error.message,
      });
    }
  },

  getResultsByUserId: async (req, res) => {
    const { user_id } = req.params;

    try {
      // Modify the query to fetch from the correct table 'exam_results'
      const results = await hostedresult.getResultsByUserId(user_id);

      if (results.length === 0) {
        return res.status(404).json({ error: "No results found for this user" });
      }

      // Helper function to safely parse JSON
      const safeJsonParse = (data) => {
        if (!data || data === 'null' || data === '') {
          return []; // Return an empty array if the field is null or empty
        }

        try {
          return JSON.parse(data);
        } catch (e) {
          console.error('Error parsing JSON:', e); // Log the error
          return []; // Return an empty array if parsing fails
        }
      };

      // Map over the results and log the raw data for debugging
      const formattedResults = results.map((row) => {
        console.log('Raw question_text:', row.question_text); // Log raw data
        console.log('Raw selected_option:', row.selected_option);
        console.log('Raw correct_option:', row.correct_option);

        return {
          ...row,
          question_text: safeJsonParse(row.question_text),
          selected_option: safeJsonParse(row.selected_option),
          correct_option: safeJsonParse(row.correct_option),
        };
      });

      res.json({ success: true, data: formattedResults });
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
