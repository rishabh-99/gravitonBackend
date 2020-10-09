/*
File Description: Defining the DocumentType model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
//importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'documenttype';

// defining the shema for the documentType model 
const Documenttype = sequelize.define('documenttype',
{
    /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

    documenttype_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    documenttype_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line

/*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

Documenttype.removeAttribute('id');

// exporting the whole module 
module.exports = Documenttype;
