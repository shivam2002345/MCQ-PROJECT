const AdminRequest = require('../models/AdminRequestModel');
const eventEmitter = require('../events/eventEmitter'); // Ensure correct path
const notificationEvents = require('../events/notificationEvents'); // Ensure correct path
const Notification = require('../models/AdminRequestModel')
// Fetch all pending requests (same as unhandled requests)
const getPendingRequests = async (req, res) => {
  try {
    const requests = await AdminRequest.findAll({ where: { request_status: 0 } });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch all unhandled requests (optional, but kept for clarity)
const getUnhandledRequests = async (req, res) => {
  try {
    const requests = await AdminRequest.findAll({ where: { request_status: 0 } });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Accept a request
const acceptRequest = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the request from the database
    const request = await AdminRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update the request status to accepted
    request.request_status = 1; // Mark as accepted
    await request.save();

    // Emit the notification event
    eventEmitter.emit(notificationEvents.REQUEST_ACCEPTED, {
      userId: request.user_id,
      note: request.note,
      username: request.username, // If needed for notifications
      email: request.email, // If needed for notifications
    });

    // Respond with the updated request
    res.json(request);
  } catch (error) {
    console.error('Error in acceptRequest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const rejectRequest = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the request from the database
    const request = await AdminRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update the request status to rejected
    request.request_status = 3; // Mark as rejected (or whatever logic is appropriate)
    await request.save();

    // Emit the notification event
    eventEmitter.emit(notificationEvents.REQUEST_REJECTED, {
      userId: request.user_id,
      note: request.note,
      username: request.username, // If needed for notifications
      email: request.email, // If needed for notifications
    });

    // Respond with the updated request
    res.json(request);
  } catch (error) {
    console.error('Error in rejectRequest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getPendingRequests,    // This function remains unchanged
  getUnhandledRequests,   // This function has been added to maintain clarity
  acceptRequest,
  rejectRequest,
};
