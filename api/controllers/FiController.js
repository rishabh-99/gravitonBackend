/*
File DEscription: Creating a controller to perform API operations with database
Author: Rishabh Merhotra
logs: 07/10/2020 - Added joi validation 
*/
// Importing all the models from the model folder 
const FI = require('../models/FI');



// importing the database confifurations from the datavbase folder 
const sequelize = require('../../config/database');
const UserProfile = require('../models/User-profile');
const Addressproof = require('../models/Addressproof');
const Financetype = require('../models/Financetype');
const Homeaccesibility = require('../models/Homeaccesibility');
const Housecondition = require('../models/Housecondition');
const Localitytype = require('../models/Localitytype');
const Noc = require('../models/NOC');
const Officeaccesibility = require('../models/Officeaccesibility');
const Officecondition = require('../models/Officecondition');
const Physicalcondition = require('../models/Physicalcondition');
const Ridequality = require('../models/Ridequality');
const Sourcetype = require('../models/Sourcetype');





// Defining a controller
const FIController = () => {


  const register = async (req, res) => {


    try {
      const { body } = req;
      await FI.create({
        'fi_answers': body.fi_answers,
        'related_aadhar': body.related_aadhar,
        'related_pan': body.related_pan
      });

      const userProfile = await UserProfile.findOne({
        where: {
          'related_pan': body.related_pan
        }
      })
      let loan_number = 0;
      let counter = 0;
      for (loan of userProfile.details_json[userProfile.user_id].loans) {
        if (loan.__loan_id == body.__loan_id) {
          loan_number = counter
        }
        counter++;
      }

      userProfile.details_json[userProfile.user_id].loans[loan_number].fi_data = body.fi_answers
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.fi_submitted.status = true;
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.fi_submitted.time_stamp = new Date();

      await UserProfile.update({
        'details_json': userProfile.details_json
      }, { where: { 'user_id': userProfile.user_id } })
      return res.status(200).json({ msg: 'Operation Successful' })
    } catch (err) {
      console.log(err);
      // 500 error returns "internal server error"
      return res.status(500).json({ msg: err });
    }
  }

  const getComboBoxData = async (req, res) => {
    try {
      const AddressproofModel = await Addressproof.findAll();
      const FinancetypeModel = await Financetype.findAll();
      const HomeaccessibilityModel = await Homeaccesibility.findAll();
      const HouseconditionModel = await Housecondition.findAll();
      const LocalitytypeModel = await Localitytype.findAll();
      const NocModel = await Noc.findAll();
      const OfficeaccesibilityModel = await Officeaccesibility.findAll();
      const OfficeconditionModel = await Officecondition.findAll();
      const PhysicalconditionModel = await Physicalcondition.findAll();
      const RidequalityModel = await Ridequality.findAll();
      const SourcetypeModel = await Sourcetype.findAll();

      return res.status(200).json({
        AddressproofModel, FinancetypeModel, HomeaccessibilityModel, HouseconditionModel,
        LocalitytypeModel, NocModel, OfficeaccesibilityModel, OfficeconditionModel, PhysicalconditionModel,
        RidequalityModel, SourcetypeModel
      })

    } catch (err) {
      // 500 error returns "internal server error"
      return res.status(500).json({ msg: err });
    }
  }
  return {
    // returning all the functions form the controller
    register,
    getComboBoxData
  };
};







// exporting the module 
module.exports = FIController
