/*
File Description: Making the Database authentications with respect to environments 
Author: Rishabh Merhotra 
*/

// importing the database configurations 
const database = require('../../config/database');

const dbService = (environment, migrate) => {
  // authenticating the database
  const authenticateDB = () => database.authenticate();
  
  const dropDB = () => database.drop();

  const syncDB = () => database.sync();

  const successfulDBStart = () => (
    // returns if successful connection on the console
    console.info('connection to the database has been established successfully')
  );

  const errorDBStart = (err) => (
    // catches the error if any 
    console.info('unable to connect to the database:', err)
  );

  const wrongEnvironment = () => {
    // warns if we are in wrong environment 
    console.warn(`only development, staging, test and production are valid NODE_ENV variables but ${environment} is specified`);
    return process.exit(1);
  };

  const startMigrateTrue = async () => {
    try {
      // await syncDB();
      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startMigrateFalse = async () => {
    try {
      // dropping the database 
      await dropDB();
      await syncDB();
      successfulDBStart();
    } catch (err) {
      // catches the error if any 
      errorDBStart(err);
    }
  };

  const startDev = async () => {
    try {
      //  authentication
      await authenticateDB();

      if (migrate) {
        // if its migration , then migrateTrue is called 
        return startMigrateTrue();
      }

      return startMigrateFalse();
    } catch (err) {
      // catches error if any 
      return errorDBStart(err);
    }
  };

  const startStage = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        // if migrate in the start stage then called 
        return startMigrateTrue();
      }

      return startMigrateFalse();
    } catch (err) {
      // catches error if any 
      return errorDBStart(err);
    }
  };

  const startTest = async () => {
    try {
      // for the testing environment 
      await authenticateDB();
      await startMigrateFalse();
    } catch (err) {
      // catches the error for the db starting
      errorDBStart(err);
    }
  };

  const startProd = async () => {
    try {
      // for the production level environment 
      await authenticateDB();
      // await till the authentication is done and calls the function
      await startMigrateFalse();
    } catch (err) {
     // catches the erorr for error in database start
      errorDBStart(err);
    }
  };

  const start = async () => { 
    // switch case for the environment 
    switch (environment) {
      case 'development':
        await startDev();
        break;
      case 'staging':
        await startStage();
        break;
      case 'testing':
        await startTest();
        break;
      case 'production':
        await startProd();
        break;
      default:
        await wrongEnvironment();
    }
  };

  return {
    // returning the start function
    start,
  };
};
// exporting the dbservice module 

module.exports = dbService;
