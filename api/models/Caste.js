const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'caste';

const Caste = sequelize.define('caste',
{
    caste_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    caste_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Caste.removeAttribute('id');

module.exports = Caste;
