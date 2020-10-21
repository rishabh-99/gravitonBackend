/*
File Description: Defining the Caste model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/

// importing the sequelize library
const Sequelize = require('sequelize');
// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'emi_schedule_pending';

// Defining the schema for the model Caste
const EmiSchedulePending = sequelize.define('emi_schedule_pending',
{
    profile_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: {
          tableName: 'user_profile',
        },
        key: 'user_id'
      }
    },
    loan_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
EmiSchedulePending.removeAttribute('id');
/*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

// exporting the whole module 

module.exports = EmiSchedulePending;
