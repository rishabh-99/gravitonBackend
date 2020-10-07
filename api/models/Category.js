/*
File Description: Defining the Category model and creating the table for 
same with respective fields 
Author: Rishabh Merhotra 
*/

// importing the sequelize library
const Sequelize = require('sequelize');
// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'category';

// Defining the schema for the Category model with required fields 
const Category = sequelize.define('category',
{
   /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */
    category_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
/*
Removing the  id attribure from all the fields
helps to send the reuired field and explicit informaiton
*/

Category.removeAttribute('id');

// exporting the whole module
module.exports = Category;
