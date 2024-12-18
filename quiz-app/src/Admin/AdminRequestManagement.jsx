import React, { useEffect, useState } from "react";
import axios from "axios";
import  logAction  from "../utils/logAction"; // Import logAction
import "./AdminRequestManagement.css";

const AdminRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch all pending requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/admin/new/requests");
      setRequests(response.data);
      setLoading(false);
      logAction("Successfully fetched requests"); // Log successful fetch
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
      logAction("Error fetching requests"); // Log error
    }
  };

  // Handle status change
  const handleStatusChange = async (request_id, status) => {
    try {
      const body = {
        status: status,
        message: status === "rejected" ? "We currently do not need additional admins." : undefined,
      };
      const response = await axios.put(`http://localhost:8080/api/admin/request/${request_id}`, body);
      setMessage(response.data.message);
      fetchRequests(); // Refresh the list
      logAction(`Status for request ID ${request_id} updated to ${status}`); // Log status change
    } catch (error) {
      console.error("Error updating request status:", error);
      logAction(`Error updating request ID ${request_id} status`); // Log error
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="admin-request-management">
      <h2>Admin Request Management</h2>
      {message && <div className="status-message">{message}</div>}
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length > 0 ? (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>User ID</th>
              <th>Note</th>
              <th>Status</th>
              <th>Requested On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.request_id}>
                <td>{request.request_id}</td>
                <td>{request.user_id}</td>
                <td>{request.note}</td>
                <td>{request.status}</td>
                <td>{new Date(request.requested_on).toLocaleString()}</td>
                <td>
                  <select
                    onChange={(e) => handleStatusChange(request.request_id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Action
                    </option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending requests.</p>
      )}
    </div>
  );
};

export default AdminRequestManagement;
