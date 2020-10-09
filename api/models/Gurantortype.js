/*
File Description: Defining the Gurantor Type model and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
//importing the cofigurations of the databasee
const sequelize = require('../../config/database');

const tableName = 'gurantortype';
//defining the schema for the gurantortype model 
const Gurantortype = sequelize.define('gurantortype',
{
      /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

    gurantortype_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gurantortype_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
  /*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/
Gurantortype.removeAttribute('id');

// exporting the whole module 

module.exports = Gurantortype;
