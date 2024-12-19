// src/utils/logAction.js
import axios from 'axios';

const logAction = async (action, details) => {
    try {
        await axios.post('https://mcq-project-backend.onrender.com/api/logs', { action, details, timestamp: new Date() });
    } catch (error) {
        console.error('Failed to log action:', error.message);
    }
};

export default logAction;
