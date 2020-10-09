/*
File Description: Defining the Applicant model and creating the table for same 
Author: Rishabh Merhotra 
*/

// importing the sequelize library
const Sequelize = require('sequelize');

// importing the configurations of the database
const sequelize = require('../../config/database');

const tableName = 'applicant';


//creating the Model 
const Applicant = sequelize.define('applicant',
{
     /* giving the content type : "".
      setting allowNull to false will add NOT NULL to the column,
      Auto-increment mamkes the iterations with columns in db
      primary-key is used to hook to the feild
       */


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
        // refering to other models and generating a key 
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

/*
Removing the attribure from all the fields
helps to send the reuired field and explicit informaiton
*/
Applicant.removeAttribute('id');
// exporting the whole module 
module.exports = Applicant;
