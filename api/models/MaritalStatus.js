/*
File Description: Defining the Marital Status and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
// Importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'maritalstatus';

//Marital Status Schema
const MaritalStatus = sequelize.define('maritalstatus',
{
      /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

    maritalstatus_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    maritalstatus_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line

MaritalStatus.removeAttribute('id');
//exporting the whole module 
module.exports = MaritalStatus;
