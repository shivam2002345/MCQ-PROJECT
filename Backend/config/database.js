require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');

// PostgreSQL Pool Configuration for Raw Queries
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for cloud-hosted databases with self-signed certificates
  },
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Timeout after 5 seconds
});

// Sequelize Configuration for ORM
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Disable logging; set to console.log for debugging
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for cloud-hosted databases with self-signed certificates
    },
  },
});

// Function to Test and Connect Databases
const connectDBs = async () => {
  try {
    // Test the pg pool connection
    const client = await pool.connect();
    console.log('Database connected successfully (pg pool)');
    client.release(); // Release the client back to the pool

    // Test the Sequelize connection
    await sequelize.authenticate();
    console.log('Database connected successfully (Sequelize)');
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error(error.stack); // Print stack trace for detailed debugging
    process.exit(1); // Exit the process with failure
  }
};

// Graceful Shutdown for Cleanup
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');

  try {
    await pool.end();
    console.log('PostgreSQL pool has ended');
  } catch (err) {
    console.error('Error during PostgreSQL pool shutdown:', err);
  }

  try {
    await sequelize.close();
    console.log('Sequelize connection closed');
  } catch (err) {
    console.error('Error during Sequelize shutdown:', err);
  }

  process.exit(0); // Exit the process after cleanup
});

// Call connectDBs to test the connections on startup
connectDBs();

// Export the pool, Sequelize instance, and connectDBs function
module.exports = {
  pool,        // For raw SQL queries
  sequelize,   // For ORM-based operations
  connectDBs,  // Function to connect to the databases
};
