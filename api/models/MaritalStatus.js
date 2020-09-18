const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'maritalstatus';

const MaritalStatus = sequelize.define('maritalstatus',
{
    maritalstatus_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    maritalstatus_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
MaritalStatus.removeAttribute('id');

module.exports = MaritalStatus;
