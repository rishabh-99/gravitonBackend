const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'gurantortype';

const Gurantortype = sequelize.define('gurantortype',
{
    gurantortype_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gurantortype_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Gurantortype.removeAttribute('id');

module.exports = Gurantortype;
