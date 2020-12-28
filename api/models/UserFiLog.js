/*
File Description: Defining Uesr Kyc logs and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
//importing the database configurations 
const sequelize = require('../../config/database');

const tableName = 'user_fi_log';

// User Kyc Logs Schema 
const UserFiLog = sequelize.define('user_fi_log',
{
    log_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'login',
        },
        key: 'user_id'
      }
    },
    profile_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: {
          tableName: 'user_profile',
        },
        key: 'user_id'
      }
    },
    related_aadhar: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fi_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    loan_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });
  // Keeping the time stamps false , ignores the time stamps feild in database

// eslint-disable-next-line

UserFiLog.removeAttribute('id');

// exporting the User_Kyc Module 
module.exports = UserFiLog;



