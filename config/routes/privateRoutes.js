const CarController = require("../../api/controllers/CarController");

const privateRoutes = {
  'GET /logins': 'LoginController.getAll',
  'POST /CAR/create': 'CarController.register',
  'GET /CAR/getForUser': 'CarController.get',
  'GET /CAR/getAllAadhar': 'CarController.getAadharList',
  'GET /CAR/getAllPan': 'CarController.getPanList',
  'GET /CAR/getFnameWithAadhar': 'CarController.getFnameAndAadhar',
  'GET /CAR/getComboBoxData': 'CarController.getComboBoxData'
  // 'POST /createUserProfile': 'UserProfileController.create',
  // 'GET /userProfiles': 'UserProfileController.getAll'
};

module.exports = privateRoutes;
