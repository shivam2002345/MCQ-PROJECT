const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database'); // Adjust path as necessary

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tech_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  level_id: {
    type: DataTypes.INTEGER,
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_a: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_b: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_c: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_d: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  correct_option: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtopic_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'questions',
  timestamps: false,
});

module.exports = Question;
