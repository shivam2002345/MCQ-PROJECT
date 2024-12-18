const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a PostgreSQL pool for raw SQL queries
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Load DB connection string from .env
  max: 20, // Max number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Timeout after 2 seconds if unable to connect
});

// Create a Sequelize instance for ORM
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to true if you want to see the SQL queries
});

// Test the pg pool connection
pool.connect()
  .then(client => {
    console.log('Database connected successfully (pg pool)');
    client.release(); // Release the client back to the pool
  })
  .catch(err => {
    console.error('Error acquiring client from the pool', err.stack);
  });

// Test the Sequelize connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully (Sequelize)');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err.message);
    console.error('Stack trace:', err.stack); // Log stack trace for debugging
  });

// Gracefully shutdown PostgreSQL pool and Sequelize connections
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  
  // Close the PostgreSQL pool
  pool.end()
    .then(() => {
      console.log('PostgreSQL pool has ended');
    })
    .catch(err => {
      console.error('Error during PostgreSQL shutdown', err);
    });

  // Close the Sequelize connection
  sequelize.close()
    .then(() => {
      console.log('Sequelize connection closed');
      process.exit(0); // Exit the process after clean shutdown
    })
    .catch(err => {
      console.error('Error during Sequelize shutdown', err);
      process.exit(1); // Exit the process if cleanup fails
    });
});

// Export both the pg pool and Sequelize instance
module.exports = {
  pool,
  sequelize,
};
