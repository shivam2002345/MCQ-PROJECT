const sequelize = require('../config/dbn.js');  // Your sequelize instance
const { DataTypes } = require("sequelize");

const HostedExam = sequelize.define('HostedExam', {
  exam_id: {  // Changed from `id` to `exam_id`
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
  admin_id: {  // Added admin_id field
    type: DataTypes.INTEGER,
    allowNull: true,  // Optional, or set to false if required
  },
}, {
  tableName: 'hosted_exam',
  timestamps: false,
});

module.exports = HostedExam;
