const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a PostgreSQL pool for raw SQL queries
const pool = new Pool({
  connectionString: process.env.DATABASE_URL // Load DB connection string from .env
});

// Create a Sequelize instance for ORM
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to true if you want to see the SQL queries
});

// Test the pg pool connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Database connected successfully (pg pool)');
    release(); // Release the client back to the pool
  }
});

// Test the Sequelize connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully (Sequelize)');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Export both the pg pool and Sequelize instance
module.exports = {
  pool,
  sequelize,
};
