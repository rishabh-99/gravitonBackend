/*
File Description: Defining the Loan model and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
//importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'leads';

//defining a loan schema for the loan model 
const Leads = sequelize.define('leads',
{
    token: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    data: {
      type: Sequelize.JSON,
      allowNull: false
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
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });
Leads.removeAttribute('id');
// eslint-disable-next-line

// exporting the whole module 
module.exports = Leads;
