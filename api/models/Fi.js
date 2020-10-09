
/*
File Description: Defining the fi model and creating the table for 
same with respective fields 
Author: Rishabh Mehrotra 
*/
//importing the sequelize package

const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'fi';

const FI = sequelize.define('fi',
{
     /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

    fi_id: {
      autoIncrement: true,
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    fi_answers: {
      type: Sequelize.JSON,
      allowNull: true
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
    }
  }, { tableName, timestamps: false, });

    /*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

// eslint-disable-next-line
FI.removeAttribute('id');

module.exports = FI;