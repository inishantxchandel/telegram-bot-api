/* eslint-disable @typescript-eslint/no-var-requires */

const { Sequelize } = require('sequelize');
import pg from 'pg';

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'healthtrip_telegram_bot',
  username: 'healthtrip_telegram_bot',
  password: 'teBXxD9EVHW6x9NG5h5cPtjEok9cFj2z',
  host: 'dpg-ckt29h8168ec73bv7n6g-a.oregon-postgres.render.com',
  dialectModule: pg, // I've added this.

  port: 5432, // Change the port if necessary
  ssl: true, // Enable SSL/TLS
  dialectOptions: {
    ssl: {
      require: true, // Make SSL/TLS mandatory
    },
  },
});

module.exports = sequelize;
