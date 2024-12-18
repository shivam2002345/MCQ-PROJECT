const SuperAdminRequest = require('../models/SuperAdminRequest');

// Controller to create a new request
const createRequest = async (req, res) => {
    console.log('Request Body:', req.body);  // Log the entire body
  
    const { admin_id, request_title, request_description } = req.body;
  
    console.log('admin_id:', admin_id);  // Log admin_id
    console.log('request_title:', request_title);  // Log request_title
  
    // Validate the request body
    if (!admin_id || !request_title) {
      return res.status(400).json({ error: 'Admin ID and request title are required' });
    }
  
    try {
      // Pass the whole body as an object to the addRequest function
      const newRequest = await SuperAdminRequest.addRequest({ admin_id, request_title, request_description });
      res.status(201).json(newRequest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `Failed to create request: ${err.message}` });
    }
};

// Controller to get all requests
const getAllRequests = async (req, res) => {
  try {
    // Assuming SuperAdminRequest.getAllRequests() retrieves all requests from the database
    const requests = await SuperAdminRequest.getAllRequests();
    res.status(200).json(requests);  // Send back the list of requests
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch requests: ${err.message}` });
  }
};

// Controller to get a request by ID
const getRequest = async (req, res) => {
  const { id } = req.params;

  try {
    // Assuming SuperAdminRequest.getRequestById() fetches a request by its ID
    const request = await SuperAdminRequest.getRequestById(id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.status(200).json(request);  // Send back the request details
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch request: ${err.message}` });
  }
};

// Controller to update the status of a request (e.g., Mark as Resolved)
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;  // e.g., 'Resolved'

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    // Assuming SuperAdminRequest.updateRequestStatus() updates the status in the database
    const updatedRequest = await SuperAdminRequest.updateRequestStatus(id, status);
    
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.status(200).json(updatedRequest);  // Send back the updated request
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to update request status: ${err.message}` });
  }
};

module.exports = { createRequest, getAllRequests, getRequest, updateRequestStatus };
