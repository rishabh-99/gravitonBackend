/*
File DEscription: Creating the pricate Routes to perform API operations with database
Author: Rishabh Merhotra
*/


// importing the carcontroller to perform sequelize operations 
const CarController = require("../../api/controllers/CarController");

const privateRoutes = {
  // Login Controller Routes
  'GET /logins': 'LoginController.getAll',
  
  'POST /User/disableUser': 'LoginController.disableUser',

  // Car Controller Routes
  'GET /CAR/getForUser': 'CarController.get',
  'GET /CAR/getAllAadhar': 'CarController.getAadharList',
  'GET /CAR/getAllPan': 'CarController.getPanList',
  'GET /CAR/getFnameWithAadhar': 'CarController.getFnameAndAadhar',
  'GET /CAR/getComboBoxData': 'CarController.getComboBoxData',
  'GET /CAR/getCountOfKyc': 'CarController.getCountOfKyc',
  'GET /CAR/getProfileIdList': 'CarController.getUserProfileID',
  'GET /CAR/getProfileForID': 'CarController.getProfileForProfileID',

  'POST /CAR/create': 'CarController.register',
  'POST /CAR/insertNewInkredoDetails': 'CarController.insertBorrowerDetails',
  'POST /CAR/insertNewLoan': 'CarController.insertNewLoan'

  // 'POST /createUserProfile': 'UserProfileController.create',
  // 'GET /userProfiles': 'UserProfileController.getAll'

  
  // Fi controller Routes 

  // 'POST /FI/CreateFi': 'FiController.register'

};

module.exports = privateRoutes;