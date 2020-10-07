/*
File Description: Defining the Gurantor model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');

// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'gurantor';

// defining the shcema for gurantor model 
const Gurantor = sequelize.define('gurantor',
{
      /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

    gurantor_firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gurantor_middlename: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "NULL"
    },
    gurantor_lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gurantor_currentaddress: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gurantor_mobile: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gurantor_relation: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "NULL"
    },
    gurantor_realtedpan: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        // refering to other tables and generating a key 
        model: {
          tableName: 'document',
        },
        key: 'document_pan'
      }
    },
    gurantor_realtedaadhar: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_aadhar'
      }
    },
    gurantortype_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'gurantortype',
        },
        key: 'gurantortype_id'
      }
    }
  }, { tableName, timestamps: false, });
  /*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

  Gurantor.removeAttribute('id');
// eslint-disable-next-line

//exporting the whole module
module.exports = Gurantor;
