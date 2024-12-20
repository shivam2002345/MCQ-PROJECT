import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserList.css';
import avatar from '../assets/avatar.svg';
import logAction from '../utils/logAction'; // Import logAction.js

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Use navigate to redirect

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://mcq-project-backend.onrender.com/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = async (user) => {
        try {
            // Log the action before navigating
            await logAction('View User', `User with ID: ${user.user_id} viewed`);
            // Navigate to the user details page
            navigate(`/admin/users/${user.user_id}`);
        } catch (err) {
            console.error('Error logging action:', err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p className="text-center">Loading users...</p>;
    if (error) return <div className="alert alert-danger text-center" role="alert">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 user-Heading">User List</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover user-list-table">
                    <thead className="thead-dark">
                        <tr>
                            <th className="text-center">Profile</th>
                            <th className="text-center">Name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
                                <td className="text-center">
                                    <img src={avatar} alt="Profile" className="user-avatar" />
                                </td>
                                <td className="text-center">{user.name}</td>
                                <td className="text-center">{user.email}</td>
                                <td className="text-center">{user.user_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
