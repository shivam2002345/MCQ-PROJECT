import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserList.css';
import avatar from '../assets/avatar.svg';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Use navigate to redirect

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p className="text-center">Loading users...</p>;
    if (error) return <div className="alert alert-danger text-center" role="alert">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 user-Heading" >User List</h2>
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
                            <tr key={user.user_id} onClick={() => navigate(`/admin/users/${user.user_id}`)} style={{ cursor: 'pointer' }}>
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
