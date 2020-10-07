/*
File Description: Defining the Document model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
//importing the configurations for the database
const sequelize = require('../../config/database');

const tableName = 'document';
// defining the schema for the document model 
const Document = sequelize.define('document',
{ 
   /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

    document_pan: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    document_aadhar: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    document_optional: {
      type: Sequelize.STRING,
      allowNull: true
    },
    document_cibil: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    document_remark: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "NULL"
    },
    document_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {

        //refering to the other models and generating a key 
        model: {
          tableName: 'documenttype',
        },
        key: 'documenttype_id'
      }
    },
    progress_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'progress',
        },
        key: 'progress_id'
      }
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
/*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

Document.removeAttribute('id');

// exporting the whole module 
module.exports = Document;
