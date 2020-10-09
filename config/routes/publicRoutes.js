const publicRoutes = {
  'POST /register': 'LoginController.register', // alias for POST /Login
  'POST /login': 'LoginController.login',
  'POST /validate': 'LoginController.validate',

  'POST /CAR/insertNewInkredoDetails': 'CarController.insertBorrowerDetails'
};

module.exports = publicRoutes;
