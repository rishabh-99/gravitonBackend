const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'acquaintance';

const Acquaintance = sequelize.define('acquaintance',
{
    acquaintance_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    acquaintance_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Acquaintance.removeAttribute('id');

module.exports = Acquaintance;
