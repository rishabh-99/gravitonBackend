/*
File Description: Defining Uesr Kyc logs and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
//importing the database configurations 
const sequelize = require('../../config/database');

const tableName = 'user_kyc_log';

// User Kyc Logs Schema 
const User_kyc_log = sequelize.define('user_kyc_log',
{
     /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

    log_id: {
      autoIncrement: true,
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
       // refering to the other tables and generating a key 

        model: {
          tableName: 'login',
        },
        key: 'user_id'
      }
    },
    related_aadhar: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_aadhar'
      }
    },
    related_pan: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_pan'
      }
    },
    kyc_date: {
      // getting the date and time details
      type: Sequelize.DATEONLY,
      allowNull: false,
      //Literal is used  i.e. something that will not be escaped, keeps it specific 
      defaultValue: sequelize.literal('CURRENT_DATE')
    }
  }, { tableName, timestamps: false, });
  // Keeping the time stamps false , ignores the time stamps feild in database

// eslint-disable-next-line

User_kyc_log.removeAttribute('id');

// exporting the User_Kyc Module 
module.exports = User_kyc_log;
