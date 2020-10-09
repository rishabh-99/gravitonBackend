/*
File Description: Defining the Marital Status and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
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
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    details_json: {
      type: DataTypes.JSON,
      allowNull: true
    },
    related_aadhar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_pan: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }  , { tableName, timestamps: false, });

// eslint-disable-next-line

UserProfile.removeAttribute('id');
//exporting the whole module 
module.exports = UserProfile;
