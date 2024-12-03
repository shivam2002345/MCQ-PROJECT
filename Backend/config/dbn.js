require('dotenv').config();  // Load environment variables

const { Sequelize } = require('sequelize');

// Configure Sequelize to connect to PostgreSQL using DATABASE_URL from environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,  // Disable logging for cleaner output
    dialectOptions: {
        // Uncomment the SSL configuration below if connecting to a remote PostgreSQL database that requires SSL
        /*
        ssl: {
            require: true,
            rejectUnauthorized: false,  // Only for development; remove in production
        },
        */
    },
});

// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch((err) => console.error('Error connecting to the database:', err));

// Sync the database (useful for initial setup or development)
// Uncomment the line below to sync models with the database (creates/updates tables)
// Note: For production, consider using migrations instead of sync
/*
sequelize.sync({ alter: true })
    .then(() => console.log('Database synchronized...'))
    .catch((error) => console.error('Error synchronizing database:', error));
*/

module.exports = sequelize;
