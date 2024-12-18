// Backend: logController.js
const fs = require('fs');
const path = require('path');

// Log action to a file
const logAction = async (req, res) => {
    const { action, details, timestamp } = req.body;
    const logMessage = `${timestamp} - ACTION: ${action} - DETAILS: ${details}\n`;

    // Define the path to the log file
    const logFilePath = path.join(__dirname, 'logs', 'action_logs.txt');

    try {
        // Ensure the 'logs' directory exists
        if (!fs.existsSync(path.dirname(logFilePath))) {
            fs.mkdirSync(path.dirname(logFilePath));
        }

        // Append the log message to the file
        fs.appendFileSync(logFilePath, logMessage);

        // Send a success response
        res.status(200).send('Log entry created');
    } catch (error) {
        console.error('Failed to log action:', error.message);
        res.status(500).send('Failed to log action');
    }
};

module.exports = { logAction };
