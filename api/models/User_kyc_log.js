const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'user_kyc_log';

const User_kyc_log = sequelize.define('user_kyc_log',
{
    log_id: {
      autoIncrement: true,
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'login',
        },
        key: 'user_id'
      }
    },
    related_aadhar: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_aadhar'
      }
    },
    related_pan: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_pan'
      }
    },
    kyc_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_DATE')
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
User_kyc_log.removeAttribute('id');

module.exports = User_kyc_log;
