import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminSubtopicsPage.css'; // Add custom styling as needed
import logAction from '../utils/logAction'; // Import logAction function

const AdminSubtopicsPage = () => {
    const [technologies, setTechnologies] = useState([]);
    const [selectedTechnology, setSelectedTechnology] = useState('');
    const [subtopics, setSubtopics] = useState([]);
    const [newSubtopic, setNewSubtopic] = useState('');
    const [editSubtopicId, setEditSubtopicId] = useState(null);
    const [editSubtopicName, setEditSubtopicName] = useState('');
    const [fetchError, setFetchError] = useState(null);

    // Fetch all technologies
    const fetchTechnologies = async () => {
        try {
            const response = await axios.get('https://mcq-project-backend.onrender.com/api/technologies');
            if (response.status === 200) {
                setTechnologies(response.data);
            } else {
                console.error('Unexpected response:', response);
                alert('Failed to fetch technologies. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching technologies:', error.message);
            alert('Error fetching technologies. Check the backend server.');
        }
    };

    // Fetch subtopics for the selected technology
    const fetchSubtopics = async (tech_id) => {
        try {
            const response = await axios.get(`https://mcq-project-backend.onrender.com/api/subtopics/${tech_id}`);
            if (response.data && Array.isArray(response.data)) {
                setSubtopics(response.data);
            } else {
                throw new Error('Invalid data format from API');
            }
        } catch (error) {
            console.error('Error fetching subtopics:', error);
            setSubtopics([]);
        }
    };

    // Check for duplicate subtopic names
    const isDuplicateSubtopic = (name) => {
        return subtopics.some(
            (subtopic) => subtopic.subtopic_name.toLowerCase() === name.toLowerCase()
        );
    };

    // Add a new subtopic
    const handleAddSubtopic = async () => {
        if (!selectedTechnology) {
            alert('Please select a technology first.');
            return;
        }
        if (!newSubtopic.trim()) {
            alert('Subtopic name cannot be empty.');
            return;
        }
        if (isDuplicateSubtopic(newSubtopic)) {
            alert('Subtopic name already exists. Please use a unique name.');
            return;
        }

        try {
            const response = await axios.post('https://mcq-project-backend.onrender.com/api/subtopics', {
                tech_id: selectedTechnology,
                subtopic_name: newSubtopic,
            });
            setSubtopics([...subtopics, response.data]);
            setNewSubtopic('');

            // Log the action
            logAction('add', 'subtopic', response.data);
        } catch (error) {
            console.error('Error adding subtopic:', error);
            alert('Failed to add subtopic. Please try again.');
        }
    };

    // Delete a subtopic
    const handleDeleteSubtopic = async (subtopicId) => {
        try {
            await axios.delete(`https://mcq-project-backend.onrender.com/api/subtopics/${subtopicId}`);
            setSubtopics(subtopics.filter((subtopic) => subtopic.subtopic_id !== subtopicId));

            // Log the action
            logAction('delete', 'subtopic', { subtopic_id: subtopicId });
        } catch (error) {
            console.error('Error deleting subtopic:', error);
            alert('Failed to delete subtopic. Please try again.');
        }
    };

    // Edit a subtopic
    const handleEditSubtopic = async () => {
        if (!editSubtopicName.trim()) {
            alert('Subtopic name cannot be empty.');
            return;
        }
        if (
            isDuplicateSubtopic(editSubtopicName) &&
            subtopics.find((sub) => sub.subtopic_id === editSubtopicId).subtopic_name !== editSubtopicName
        ) {
            alert('Subtopic name already exists. Please use a unique name.');
            return;
        }

        try {
            const response = await axios.put(`https://mcq-project-backend.onrender.com/api/subtopics/${editSubtopicId}`, {
                subtopic_name: editSubtopicName,
            });
            setSubtopics(
                subtopics.map((subtopic) =>
                    subtopic.subtopic_id === editSubtopicId ? response.data : subtopic
                )
            );
            setEditSubtopicId(null);
            setEditSubtopicName('');

            // Log the action
            logAction('edit', 'subtopic', response.data);
        } catch (error) {
            console.error('Error editing subtopic:', error);
            alert('Failed to edit subtopic. Please try again.');
        }
    };

    useEffect(() => {
        fetchTechnologies();
    }, []);

    useEffect(() => {
        if (selectedTechnology) {
            fetchSubtopics(selectedTechnology);
        } else {
            setSubtopics([]);
        }
    }, [selectedTechnology]);

    return (
        <div className="admin-subtopics-page">
            <h1>Manage Subtopics</h1>
            <div className="select-technology">
                <label htmlFor="technologySelect">Select Technology:</label>
                <select
                    id="technologySelect"
                    value={selectedTechnology}
                    onChange={(e) => setSelectedTechnology(e.target.value)}
                >
                    <option value="">-- Select Technology --</option>
                    {technologies.map((tech) => (
                        <option key={tech.tech_id} value={tech.tech_id}>
                            {tech.tech_name}
                        </option>
                    ))}
                </select>
                {fetchError && <p className="error-message">{fetchError}</p>}
            </div>

            <div className="add-subtopic">
                <input
                    type="text"
                    placeholder="New Subtopic Name"
                    value={newSubtopic}
                    onChange={(e) => setNewSubtopic(e.target.value)}
                />
                <button onClick={handleAddSubtopic}>Add Subtopic</button>
            </div>

            <ul className="subtopics-list">
                {subtopics.length === 0 ? (
                    <li>No subtopics available.</li>
                ) : (
                    subtopics.map((subtopic) => (
                        <li key={subtopic.subtopic_id} className="subtopic-item">
                            {editSubtopicId === subtopic.subtopic_id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editSubtopicName}
                                        onChange={(e) => setEditSubtopicName(e.target.value)}
                                    />
                                    <button onClick={handleEditSubtopic}>Save</button>
                                    <button onClick={() => setEditSubtopicId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span>
                                        {subtopic.subtopic_id}: {subtopic.subtopic_name}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setEditSubtopicId(subtopic.subtopic_id);
                                            setEditSubtopicName(subtopic.subtopic_name);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSubtopic(subtopic.subtopic_id)}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AdminSubtopicsPage;
