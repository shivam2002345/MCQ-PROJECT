const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
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
    allowNull: false,
  },
  allowed_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default value if not provided
  },
}, {
  tableName: 'users',
  timestamps: false, // Assuming your table does not use timestamps
});

module.exports = User;