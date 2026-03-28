const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'generating_scenes', 'generating_images', 'generating_video', 'generating_narration', 'stitching', 'uploading', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  type: {
    type: DataTypes.ENUM('text_to_video', 'audio_to_video'),
    defaultValue: 'text_to_video',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Untitled Project',
  },
  inputData: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  outputUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'jobs',
  timestamps: true,
});

module.exports = Job;
