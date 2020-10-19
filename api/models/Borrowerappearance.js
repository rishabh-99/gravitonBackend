/*
File Description: Defining the Caste model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/

// importing the sequelize library
const Sequelize = require('sequelize');
// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'borrower_appearance';

// Defining the schema for the model Caste
const Borrower_appearance = sequelize.define('borrower_appearance',
{
    borrower_appearance_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    borrower_appearance_name: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Borrower_appearance.removeAttribute('id');
/*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

// exporting the whole module 

module.exports = Borrower_appearance;
