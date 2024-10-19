const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Ensure you're importing the correct sequelize instance

const AdminRequest = sequelize.define('AdminRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  request_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'request', // Ensure this matches your actual table name
  timestamps: false, // Change to true if you want Sequelize to manage createdAt/updatedAt fields
});

const Notification = sequelize.define('Notification', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('unread', 'read'), // For marking notifications as read/unread
    defaultValue: 'unread',
  }
});


module.exports = AdminRequest , Notification;
