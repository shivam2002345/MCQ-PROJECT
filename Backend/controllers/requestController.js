const requestModel = require('../models/requestModel');

const requestController = {
  async createRequest(req, res) {
    const { user_id, note } = req.body;

    // Input validation
    if (!user_id || !note) {
      return res.status(400).json({ message: 'User ID and note are required.' });
    }

    try {
      const newRequest = await requestModel.createRequest(user_id, note);
      res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
    } catch (error) {
      console.error('Error creating request:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = requestController;
