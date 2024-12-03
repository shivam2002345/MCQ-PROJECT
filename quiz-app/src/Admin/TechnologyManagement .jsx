import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TechnologyManagement.css'
// Spinner Component
const Spinner = () => (
  <div className="spinner">
    <div className="double-bounce1"></div>
    <div className="double-bounce2"></div>
  </div>
);

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [techName, setTechName] = useState('');
  const [editTechId, setEditTechId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    setLoading(true); // Start spinner
    try {
      const response = await axios.get('http://localhost:8080/api/technologies');
      console.log("Fetched technologies:", response.data);

      if (Array.isArray(response.data)) {
        setTechnologies(response.data);
      } else {
        console.error("Expected an array but received:", response.data);
        setTechnologies([]);
      }
    } catch (error) {
      console.error("Error fetching technologies", error);
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  const addTechnology = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/technologies', { tech_name: techName });
      setTechName('');
      fetchTechnologies();
    } catch (error) {
      console.error("Error adding technology", error);
    }
  };

  const editTechnology = (id) => {
    const tech = technologies.find(t => t.tech_id === id);
    setTechName(tech.tech_name);
    setEditTechId(id);
  };

  const updateTechnology = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to update this technology?")) {
      try {
        await axios.put(`http://localhost:8080/api/technologies/${editTechId}`, { tech_name: techName });
        setTechName('');
        setEditTechId(null);
        fetchTechnologies();
      } catch (error) {
        console.error("Error updating technology", error);
      }
    }
  };

  const deleteTechnology = async (id) => {
    if (window.confirm("Are you sure you want to delete this technology?")) {
      try {
        await axios.delete(`http://localhost:8080/api/technologies/${id}`);
        fetchTechnologies();
      } catch (error) {
        console.error("Error deleting technology", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <h2>Technology Management</h2>

        {/* Form to Add or Update Technology */}
        <form onSubmit={editTechId ? updateTechnology : addTechnology}>
          <input
            type="text"
            value={techName}
            onChange={(e) => setTechName(e.target.value)}
            placeholder="Technology Name"
            required
          />
          <button type="submit">{editTechId ? 'Update' : 'Add'} Technology</button>
        </form>

        {/* Show spinner while loading */}
        {loading ? (
          <Spinner />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Id</th>
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
                    <button onClick={() => editTechnology(tech.tech_id)}>Edit</button>
                    <button onClick={() => deleteTechnology(tech.tech_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TechnologyManagement;
