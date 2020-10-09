/*
File Description: Making public and private routes and configuring them 
Author: Rishabh Merhotra 
*/

const privateRoutes = require('./routes/privateRoutes');
const publicRoutes = require('./routes/publicRoutes');

const config = {
  migrate: true,
  privateRoutes,
  publicRoutes,
  port: process.env.PORT || '2017',
};

// exporting the module
module.exports = config;
