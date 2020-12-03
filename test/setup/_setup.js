const bodyParser = require('body-parser');
const express = require('express');

const mapRoutes = require('express-routes-mapper');
const MapRoutes = () => mapRoutes;

const config = require('../../config/');
const database = require('../../config/database');
const auth = require('../../api/policies/auth.policy');
const Loan = require('../../api/models/Loan');
const Account = require('../../api/models/Account');
const Applicant = require('../../api/models/Applicant');
const Gurantor = require('../../api/models/Gurantor');
const Document = require('../../api/models/Document');
const User_kyc_log = require('../../api/models/User_kyc_log');

const beforeAction = async () => {
  const testapp = express();
  const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
  const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');

  testapp.use(bodyParser.urlencoded({ extended: false }));
  testapp.use(bodyParser.json());

  testapp.all('/private/*', (req, res, next) => auth(req, res, next));
  testapp.use('/public', mappedOpenRoutes);
  testapp.use('/private', mappedAuthRoutes);


  await database.authenticate();
  await Loan.destroy({
    where: {},
  });
  await Account.destroy({
    where: {},
  });
  await Applicant.destroy({
    where: {},
  });
  await Gurantor.destroy({
    where: {},
  });
  await User_kyc_log.destroy({
    where: {},
  })
  await Document.destroy({
    where: {},
  })
 
  // await database.drop({force: true});
  // await database.sync().then(() => console.log('Connection to the database has been established successfully'));

  return testapp;
};

const afterAction = async () => {
  await database.query(`DELETE FROM public.account WHERE true;
  DELETE FROM public.applicant WHERE true;
  DELETE FROM public.fi WHERE true;
  DELETE FROM public.gurantor WHERE true;
  DELETE FROM public.user_kyc_log WHERE true;
  DELETE FROM public.loan WHERE true;
  DELETE FROM public.document WHERE true;
  DELETE FROM public.document_check_approve_pending WHERE true;
  DELETE FROM public.document_check_upload_pending WHERE true;
  DELETE FROM public.emi_schedule WHERE true;
  DELETE FROM public.emi_schedule_pending WHERE true;
  DELETE FROM public.fi_approval_pending WHERE true;
  DELETE FROM public.fi_assigned_pending WHERE true;
  DELETE FROM public.fi_submitted_pending WHERE true;
  DELETE FROM public.kyc_approval_pending WHERE true;
  DELETE FROM public.loan WHERE true;
  DELETE FROM public.login WHERE true;
  DELETE FROM public.user_profile WHERE true;`);
  await database.close();
};


module.exports = { beforeAction, afterAction };
