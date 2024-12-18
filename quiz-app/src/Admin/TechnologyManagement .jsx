import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import logAction from '../utils/logAction';  // Import logAction
import './TechnologyManagement.css';

// Spinner Component
const Spinner = () => (
  <div className="spinner">
    <div className="double-bounce1"></div>
    <div className="double-bounce2"></div>
  </div>
);

// Modal Component
const Modal = ({ type, message, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className={`modal ${type === 'success' ? 'modal-success' : 'modal-error'}`}>
        {type === 'success' ? (
          <FaCheckCircle className="modal-icon" />
        ) : (
          <FaExclamationCircle className="modal-icon" />
        )}
        <p>{message}</p>
        <button onClick={onClose} className="modal-close">Close</button>
      </div>
    </div>
  );
};

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [techName, setTechName] = useState('');
  const [editTechId, setEditTechId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/technologies');
      if (Array.isArray(response.data)) {
        setTechnologies(response.data);
      } else {
        setTechnologies([]);
      }
    } catch (error) {
      setErrorMessage('Error fetching technologies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = async (e) => {
    e.preventDefault();

    if (techName.trim() === '') {
      setErrorMessage('Technology name cannot be empty.');
      return;
    } else if (techName.length < 3) {
      setErrorMessage('Technology name must be at least 3 characters long.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/technologies/add', { tech_name: techName });
      setTechName('');
      setSuccessMessage('Technology added successfully!');
      fetchTechnologies();
      logAction('Add Technology', `Added technology: ${techName}`); // Log the action
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error adding technology. Please try again.');
    }
  };

  const editTechnology = (id) => {
    const tech = technologies.find(t => t.tech_id === id);
    setTechName(tech.tech_name);
    setEditTechId(id);
  };

  const updateTechnology = async (e) => {
    e.preventDefault();

    if (techName.trim() === '') {
      setErrorMessage('Technology name cannot be empty.');
      return;
    } else if (techName.length < 3) {
      setErrorMessage('Technology name must be at least 3 characters long.');
      return;
    }

    if (window.confirm("Are you sure you want to update this technology?")) {
      try {
        await axios.put(`http://localhost:8080/api/technologies/edit/${editTechId}`, { tech_name: techName });
        setTechName('');
        setEditTechId(null);
        setSuccessMessage('Technology updated successfully!');
        fetchTechnologies();
        logAction('Update Technology', `Updated technology with ID: ${editTechId} to ${techName}`); // Log the action
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error updating technology. Please try again.');
      }
    }
  };

  const deleteTechnology = async (id) => {
    if (window.confirm("Are you sure you want to delete this technology?")) {
      try {
        await axios.delete(`http://localhost:8080/api/technologies/delete/${id}`);
        setSuccessMessage('Technology deleted successfully!');
        fetchTechnologies();
        logAction('Delete Technology', `Deleted technology with ID: ${id}`); // Log the action
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error deleting technology. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <h2>Technology Management</h2>

        <div className="form-card">
          <form onSubmit={editTechId ? updateTechnology : addTechnology}>
            <input
              type="text"
              value={techName}
              onChange={(e) => setTechName(e.target.value)}
              placeholder="Enter Technology Name"
              required
            />
            <button type="submit" className="form-button">
              {editTechId ? 'Update Technology' : 'Add Technology'}
            </button>
          </form>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Technology</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {technologies.map((tech) => (
                <tr key={tech.tech_id}>
                  <td>{tech.tech_id}</td>
                  <td>{tech.tech_name}</td>
                  <td>
                    <FaEdit
                      className="action-icon edit-icon"
                      onClick={() => editTechnology(tech.tech_id)}
                    />
                    <FaTrashAlt
                      className="action-icon delete-icon"
                      onClick={() => deleteTechnology(tech.tech_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {errorMessage && (
          <Modal type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
        )}
        {successMessage && (
          <Modal type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
      </div>
    </div>
  );
};

export default TechnologyManagement;
