/*
File Description: Defining the Acquaintance model and creating the table for same 
Author: Rishabh Merhotra 
*/

// importing the sequelize library
const Sequelize = require('sequelize');
//importing the configurations from the database file
const sequelize = require('../../config/database');

const tableName = 'acquaintance';

// Defining the model with the required feilds
const Acquaintance = sequelize.define('acquaintance',
{
      /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */



    acquaintance_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    acquaintance_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Acquaintance.removeAttribute('id');

/*
Removing the attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

module.exports = Acquaintance;
