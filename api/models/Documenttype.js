const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'documenttype';

const Documenttype = sequelize.define('documenttype',
{
    documenttype_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    documenttype_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Documenttype.removeAttribute('id');

module.exports = Documenttype;
