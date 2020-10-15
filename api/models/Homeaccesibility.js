/*
File Description: Defining the Source Type and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
// Importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'homeaccesibility';

//Marital Status Schema
const Homeaccesibility = sequelize.define('homeaccesibility',
{
    homeaccesibility_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    homeaccesibility_name: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line

Homeaccesibility.removeAttribute('id');
//exporting the whole module 
module.exports = Homeaccesibility;
