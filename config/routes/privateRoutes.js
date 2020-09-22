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

  'POST /CAR/create': 'CarController.register'

  // 'POST /createUserProfile': 'UserProfileController.create',
  // 'GET /userProfiles': 'UserProfileController.getAll'
};

module.exports = privateRoutes;
