// models/Admin.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbn'); // Your sequelize instance

const Admin = sequelize.define('Admin', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_super_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING, // Can be 'rejected', 'approved', 'pending'
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  organisation_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  organisation_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mobile_no: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reason_to_be_admin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'admin',
  timestamps: false
});

module.exports = Admin;
