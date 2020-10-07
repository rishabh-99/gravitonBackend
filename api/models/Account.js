/*
File Description: Defining the Accounts model and creating the table for same 
Author: Rishabh Merhotra 
*/

// importing the sequelize library 
const Sequelize = require('sequelize');
// importing the configurations from database file
const sequelize = require('../../config/database');

const tableName = 'account';

//defiing a model for the acocund table 
const Account = sequelize.define('account',
{

  // giving the content type : "".
  //setting allowNull to false will add NOT NULL to the column,


  // making feilds for user model 
    account_bankname: {
      
      type: Sequelize.STRING,
      allowNull: true
    },
    account_ifsc: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_inhandsalary: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    account_realtedpan: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        // using reference with respect to table name.
        model: {
          tableName: 'document',
        },
        // generating a key 
        key: 'document_pan'
      }
    },
    account_realtedaadhar: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_aadhar'
      }
    }
  }, { tableName, timestamps: false, });

/*
Removing the attribure from all the fields
helps to send the reuired field and explicit informaiton
*/
// eslint-disable-next-line
Account.removeAttribute('id');

// exporting the Account module

module.exports = Account;
