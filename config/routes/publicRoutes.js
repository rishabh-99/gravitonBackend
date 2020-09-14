const publicRoutes = {
  'POST /register': 'LoginController.register', // alias for POST /Login
  'POST /login': 'LoginController.login',
  'POST /validate': 'LoginController.validate',
};

module.exports = publicRoutes;
