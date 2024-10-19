const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure DATABASE_URL is set in .env
});

// Function to connect to the database
const connectDBs = async () => {
  try {
    await pool.connect();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Export both the pool instance and the connectDB function
module.exports = {
  connectDBs,
  pool,
};