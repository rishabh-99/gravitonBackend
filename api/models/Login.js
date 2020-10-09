/*
File Description: Defining the Login model and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');
//importing the configurations of the database
const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(login) {
    login.password = bcryptService().password(login); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'login';
// Login Schema
const Login = sequelize.define('login',
{
     /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */

  user_id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  full_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true
  },
  designation: {
    type: Sequelize.STRING,
    allowNull: true
  },
  user_mobile: {
    type: Sequelize.STRING,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true
  },
  permissions: {
    type: Sequelize.JSON,
    allowNull: true
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
}, { hooks, tableName, timestamps: false, });

// eslint-disable-next-line
Login.prototype.toJSON = function () {

  // values are assigned to objects
  const values = Object.assign({}, this.get());
  //deleting the passwords after verification

  delete values.password;

  return values;
};
// exporting the whole module 
module.exports = Login;
