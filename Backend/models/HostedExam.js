const { sequelize } = require('../config/database.js'); // Import sequelize instance
const { DataTypes } = require("sequelize");

// Define the HostedExam model
const HostedExam = sequelize.define('HostedExam', {
  exam_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  technology: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  num_questions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  exam_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Default to false (exam not taken)
    allowNull: false,
  }
}, {
  tableName: 'hosted_exam',
  timestamps: false, // Disable automatic timestamps (use custom created_at and updated_at)
});

module.exports = HostedExam;
