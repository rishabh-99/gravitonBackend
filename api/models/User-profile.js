/*
File Description: Defining User Profile model  and creating the Schema  table for 
same with respective fields 
Author: Rishabh Merhotra 
*/
//importing the sequelize package
const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

//importing the configurations of the database
const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'user_profile';

const UserProfile = sequelize.define('user_profile', {

      /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */
    user_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_json: {
      type: DataTypes.JSON,
      allowNull: true
    },
    related_aadhar: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        // refering to other tables and generating a key
        model: {
          tableName: 'document',
        },
        key: 'document_aadhar'
      }
    },
    related_pan: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_pan'
      }
    }
  }, { hooks, tableName, timestamps: false, });

// eslint-disable-next-line
UserProfile.prototype.toJSON = function () {
  // Objects are assigned with users in Json Format 
  const values = Object.assign({}, this.get());

  // deleting the user passswords after verify
  delete values.password;

  return values;
};

// exporting the whole module
module.exports = UserProfile;
