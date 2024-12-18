const {pool} = require('../config/database');

// Function to get file details by file_id
const getFileById = async (fileId, category) => {
  try {
    const result = await pool.query(
      'SELECT * FROM exam_csv_files WHERE file_id = $1 AND category = $2',
      [fileId, category]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error fetching file from the database: ' + error.message);
  }
};

module.exports = { getFileById };
