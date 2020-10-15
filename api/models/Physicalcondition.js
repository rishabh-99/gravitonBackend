/*
File Description: Defining the Source Type and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
// Importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'physicalcondition';

//Marital Status Schema
const Physicalcondition = sequelize.define('physicalcondition',
{
    physicalcondition_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    physicalcondition_name: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line

Physicalcondition.removeAttribute('id');
//exporting the whole module 
module.exports = Physicalcondition;
