const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'loan';

const Loan = sequelize.define('loan',
{
    loan_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    loan_bankname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    loan_amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    loan_emi: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    loan_closuredate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    loan_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'loantype',
        },
        key: 'loantype_id'
      }
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
Loan.removeAttribute('id');
// eslint-disable-next-line


module.exports = Loan;
