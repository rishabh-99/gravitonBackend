/*
File Description: Defining the Caste model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/

// importing the sequelize library
const Sequelize = require('sequelize');
// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'emi_schedule';

// Defining the schema for the model Caste
const EmiSchedule = sequelize.define('emi_schedule',
{
    emi_schedule_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    emi_schedule_profile_id: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'user_profile',
        },
        key: 'user_id'
      },
      unique: true
    },
    emi_schedule_loan_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    emi_schedule_loan_amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    emi_schedule_interest_rate: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    emi_schedule_loan_tenure: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    emi_schedule_start_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    emi_schedule_json_object: {
      type: Sequelize.JSON,
      allowNull: true
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
EmiSchedule.removeAttribute('id');
/*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

// exporting the whole module 

module.exports = EmiSchedule;
