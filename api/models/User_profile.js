/*
File Description: Defining the Marital Status and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
Logs: Changed datatypes to Sequelize @ 09/10/2020
*/
//importing the sequelize package
const Sequelize = require('sequelize');
// Importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'user_profile';

//Marital Status Schema
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
  }  , { tableName, timestamps: false, });

// eslint-disable-next-line

UserProfile.removeAttribute('id');
//exporting the whole module 
module.exports = UserProfile;
