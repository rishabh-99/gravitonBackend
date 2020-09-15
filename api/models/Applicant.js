const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'applicant';

const Applicant = sequelize.define('applicant',
{
    applicant_firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_middlename: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "NULL"
    },
    applicant_lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_acquaintancename: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_dob: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    applicant_state: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_district: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_pincode: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_currentaddress: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_mobile: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_officeno: {
      type: Sequelize.STRING,
      allowNull: true
    },
    applicant_desgination: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "NULL"
    },
    applicant_education: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_employername: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_officeaddress: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_nearestbranch: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicant_distance: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    applicant_acquaintanceid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'acquaintance',
        },
        key: 'acquaintance_id'
      }
    },
    applicant_maritalstatusid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'maritalstatus',
        },
        key: 'maritalstatus_id'
      }
    },
    applicant_casteid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'caste',
        },
        key: 'caste_id'
      }
    },
    applicant_categoryid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'category',
        },
        key: 'category_id'
      }
    },
    applicant_pan: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'document',
        },
        key: 'document_pan'
      }
    },
    applicant_aadhar: {
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

Applicant.removeAttribute('id');
module.exports = Applicant;
