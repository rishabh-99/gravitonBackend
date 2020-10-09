const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'fi';

const FI = sequelize.define('fi',
{
    fi_id: {
      autoIncrement: true,
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    fi_answers: {
      type: Sequelize.JSON,
      allowNull: true
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
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
FI.removeAttribute('id');

module.exports = FI;
