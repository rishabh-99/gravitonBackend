/*
File Description: Defining the Borrower_incredo model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/

// importing the sequelize library
const Sequelize = require('sequelize');
// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'borrower_incredo_details';


//Defining the shcema for the model 
const Borrower_incredo_details = sequelize.define('borrower_incredo_details',
{

    /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

    borrower_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    borrower_details: {
      type: Sequelize.JSON,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Borrower_incredo_details.removeAttribute('id');
/*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

// exporting the whole module 
module.exports = Borrower_incredo_details;
