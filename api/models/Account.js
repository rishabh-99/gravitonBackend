const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'account';

const Account = sequelize.define('account',
{
    account_bankname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_ifsc: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_inhandsalary: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    account_realtedpan: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_pan'
      }
    },
    account_realtedaadhar: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_aadhar'
      }
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Account.removeAttribute('id');

module.exports = Account;
