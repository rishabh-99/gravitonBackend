/*
File Description: Defining the Loan Type model and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'loantype';

// creeating a loantype Schema for the loantype model 
const Loantype = sequelize.define('loantype',
{

        /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */
    loantype_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    loantype_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Loantype.removeAttribute('id');
// exporting the whole module 

module.exports = Loantype;
