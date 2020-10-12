/*
File Description: Defining Uesr Kyc logs and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
//importing the database configurations 
const sequelize = require('../../config/database');

const tableName = 'user_profile';

// User Kyc Logs Schema 
const UserProfile = sequelize.define('user_profile',
{
  user_id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  details_json: {
    type: Sequelize.JSON,
    allowNull: true
  },
  related_aadhar: {
    type: Sequelize.STRING,
    allowNull: true
  },
  related_pan: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, { tableName, timestamps: false, });
  // Keeping the time stamps false , ignores the time stamps feild in database

// eslint-disable-next-line

UserProfile.removeAttribute('id');

// exporting the User_Kyc Module 
module.exports = UserProfile;



