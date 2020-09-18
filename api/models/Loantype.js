const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'loantype';

const Loantype = sequelize.define('loantype',
{
    loantype_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    loantype_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Loantype.removeAttribute('id');

module.exports = Loantype;
