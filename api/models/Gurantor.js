const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'gurantor';

const Gurantor = sequelize.define('gurantor',
{
    gurantor_firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gurantor_middlename: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "NULL"
    },
    gurantor_lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gurantor_currentaddress: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gurantor_mobile: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gurantor_relation: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "NULL"
    },
    gurantor_realtedpan: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_pan'
      }
    },
    gurantor_realtedaadhar: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_aadhar'
      }
    },
    gurantortype_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'gurantortype',
        },
        key: 'gurantortype_id'
      }
    }
  }, { tableName, timestamps: false, });

  Gurantor.removeAttribute('id');
// eslint-disable-next-line


module.exports = Gurantor;
