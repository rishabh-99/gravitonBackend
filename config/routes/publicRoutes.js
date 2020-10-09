/*
File DEscription: Creating the public Routes to perform API operations with database
Author: Rishabh Merhotra
*/




const publicRoutes = {
  'POST /register': 'LoginController.register', // alias for POST /Login
  'POST /login': 'LoginController.login',
  'POST /validate': 'LoginController.validate',

  'POST /CAR/insertNewInkredoDetails': 'CarController.insertBorrowerDetails'
};

module.exports = publicRoutes;
