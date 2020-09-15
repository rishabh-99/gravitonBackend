const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'document';

const Document = sequelize.define('document',
{
    document_pan: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    document_aadhar: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    document_optional: {
      type: Sequelize.STRING,
      allowNull: true
    },
    document_cibil: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    document_remark: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "NULL"
    },
    document_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'documenttype',
        },
        key: 'documenttype_id'
      }
    },
    progress_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'progress',
        },
        key: 'progress_id'
      }
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Document.removeAttribute('id');

module.exports = Document;
