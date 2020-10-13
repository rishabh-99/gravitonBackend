/*
File Description: Calling the app from serverless
Author: Rishabh Merhotra 
*/


const app = require('./app');
const serverless = require('serverless-http');

module.exports.handler = serverless(app);
