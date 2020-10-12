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

      userProfile.details_json[userProfile.user_id].loans[body.loan_number - 1].fi_data = body.fi_answers

      await UserProfile.update({
        'details_json': userProfile.details_json
      }, { where: { 'user_id': userProfile.user_id } })
      return res.status(200).json(userProfile)
    } catch (err) {
      console.log(err);
      // 500 error returns "internal server error"
      return res.status(500).json({ msg: err });
    }
  }
  return {
    // returning all the functions form the controller
    register
  };
};







// exporting the module 
module.exports = FIController
