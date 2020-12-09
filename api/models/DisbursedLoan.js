/*
File Description: Defining the Caste model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/

// importing the sequelize library
const Sequelize = require('sequelize');
// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'disbursedLoan';

// Defining the schema for the model Caste
const DisbursedLoan = sequelize.define('disbursedLoan',
{
    profile_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    loan_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
DisbursedLoan.removeAttribute('id');

module.exports = DisbursedLoan;
