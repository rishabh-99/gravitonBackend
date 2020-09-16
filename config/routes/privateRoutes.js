const CarController = require("../../api/controllers/CarController");

const privateRoutes = {
  'GET /logins': 'LoginController.getAll',
  'POST /CAR/create': 'CarController.register',
  'GET /CAR/getForUser': 'CarController.get'
  // 'POST /createUserProfile': 'UserProfileController.create',
  // 'GET /userProfiles': 'UserProfileController.getAll'
};

module.exports = privateRoutes;
