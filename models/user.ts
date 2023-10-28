/* eslint-disable @typescript-eslint/no-var-requires */
// models/user.js

const { DataTypes } = require('sequelize');
const db = require('../config/sequelize'); // Adjust the path to your sequelize configuration file

const User = db.define('User', {
  chatId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  subscribedCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
