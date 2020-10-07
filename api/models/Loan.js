/*
File Description: Defining the Loan model and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
//importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'loan';

//defining a loan schema for the loan model 
const Loan = sequelize.define('loan',
{
      /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */


    loan_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    loan_bankname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    loan_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    loan_emi: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    loan_closuredate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    loan_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        // Refering to other tables and generating a key 
        model: {
          tableName: 'loantype',
        },
        key: 'loantype_id'
      }
    },
    account_realtedpan: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
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
Loan.removeAttribute('id');
// eslint-disable-next-line

// exporting the whole module 
module.exports = Loan;
