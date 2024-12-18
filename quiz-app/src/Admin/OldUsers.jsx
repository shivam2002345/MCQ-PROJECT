import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OldUsers.css";
import avatar from "../assets/avatar.svg";
import logAction from "../utils/logAction"; // Import logAction

const OldUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
      logAction("Successfully fetched user data"); // Log after successful fetch
    } catch (err) {
      setError(err.message);
      logAction(`Error fetching users: ${err.message}`); // Log the error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center">Loading users...</p>;
  if (error)
    return (
      <div className="alert alert-danger text-center" role="alert">
        Error: {error}
      </div>
    );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User List</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover user-list-table">
          <thead className="thead-dark">
            <tr>
              <th className="text-center">Profile</th>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">User ID</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="text-center">
                  <img src={avatar} alt="Profile" className="user-avatar" />
                </td>
                <td className="text-center">{user.name}</td>
                <td className="text-center">{user.email}</td>
                <td className="text-center">{user.user_id}</td>
                <td className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      logAction(
                        `Navigating to customize exam for user ID: ${user.user_id}`
                      ); // Log before navigating
                      navigate(`/newadmin/oldusers/customize/${user.user_id}`);
                    }}
                  >
                    Customize Exam
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OldUsers;
