const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database'); // Database connection

const users = sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      allowed_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      tableName: 'users', // Explicitly set the table name
      timestamps: false,
    }
  );
  

module.exports = users;
