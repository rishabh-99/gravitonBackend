const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'borrower_incredo_details';

const Borrower_incredo_details = sequelize.define('borrower_incredo_details',
{
    borrower_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    borrower_details: {
      type: Sequelize.JSON,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Borrower_incredo_details.removeAttribute('id');

module.exports = Borrower_incredo_details;
