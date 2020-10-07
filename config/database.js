// importing the sequelize package 
const Sequelize = require('sequelize');
// importing the path for connections 
const path = require('path');

const connection = require('./connection');

let database;

switch (process.env.NODE_ENV) {
  case 'production':
    database = new Sequelize(
      // in case of production environment
      connection.production.database,
      connection.production.username,
      connection.production.password, {
        host: connection.production.host,
        dialect: connection.production.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      },
    );
    break;
  case 'testing':
    database = new Sequelize(
      // in case of testing environment
      connection.testing.database,
      connection.testing.username,
      connection.testing.password, {
        host: connection.testing.host,
        dialect: connection.testing.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      },
    );
    break;
  default:
    database = new Sequelize(
      connection.development.database,
      connection.development.username,
      connection.development.password, {
        host: connection.development.host,
        dialect: connection.development.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        // its prefered to make the storage as cwd for development sites
        storage: path.join(process.cwd(), 'db', 'database.sqlite'),
      },
    );
}

// exporting the database
module.exports = database;
