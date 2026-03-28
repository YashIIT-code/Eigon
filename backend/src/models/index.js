const sequelize = require('../config/database');
const User = require('./User');
const Job = require('./Job');
const Character = require('./Character');
const Subscription = require('./Subscription');

// Associations
User.hasMany(Job, { foreignKey: 'userId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Character, { foreignKey: 'userId', as: 'characters' });
Character.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Job, Character, Subscription };
