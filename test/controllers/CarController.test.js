/*
File Description: Tests for the car controllers using the models 
Author: Rishabh Merhotra 
*/

// importing the super test for unit-testing the api 
const request = require('supertest');
const {
  // calling the functions from the setup file
  beforeAction,
  afterAction,
} = require('../setup/_setup');

// Importing all the models from the models folder 
const Document = require('../../api/models/Document');
const Gurantor = require('../../api/models/Gurantor');
const Applicant = require('../../api/models/Applicant');
const Account = require('../../api/models/Account');
const Loan = require('../../api/models/Loan');
const MaritalStatus = require('../../api/models/MaritalStatus');
const Acquaintance = require('../../api/models/Acquaintance');
const Caste = require('../../api/models/Caste');
const Category = require('../../api/models/Category');
const Gurantortype = require('../../api/models/Gurantortype');
const Documenttype = require('../../api/models/Documenttype');
const Loantype = require('../../api/models/Loantype');
const Login = require('../../api/models/Login');

// Importing the crypto-js package for the encryption techniques 
const CryptoJS = require("crypto-js");
// Jwt for verification of tokenizing 
const jwt = require('jsonwebtoken');
const User_kyc_log = require('../../api/models/User_kyc_log');
const UserProfile = require('../../api/models/User-profile');

let api;
let login
let token;

beforeAll(async () => {
  api = await beforeAction();
  // beforeAction called => 
  // creating a user using Login details  
  login = await Login.create({
    "user_id":1,
    "full_name": "Rime",
    "username": "rimet",
    "designation": "Boss",
    "user_mobile": "8299213792",
    "password": "Alfanzo@001",
    "password2": "Alfanzo@001",
    "permissions": "{\"Admin\": true, \"Employee\": false}",
    "is_active": true
  });
  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })

  token = res.body.token;
});

afterAll(async () => {
  await User_kyc_log.destroy({where:{}})
  // we destroy the login to keep the db clean for all the tests
  await login.destroy();

  afterAction();
});
/**
 * Register Function Tests
 */
test('CAR | Create (auth) (Successful)', async () => {

  const res = await request(api)
    .post('/private/CAR/create?user_id=1')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(
      {
        "accountModel": {
          "account_bankname": "cdd",
          "account_ifsc": "1111111111k",
          "account_number": "111111111111",
          "account_inhandsalary": 1111111111,
          "account_realtedpan": "QWETY1234O",
          "account_realtedaadhar": "222222222230"
        },
        "applicantModel": {
          "applicant_firstname": "aaaaaaaa",
          "applicant_middlename": "",
          "applicant_lastname": "aaaaaaaaaa",
          "applicant_acquaintancename": "aaaaaaaaaaaa",
          "applicant_dob": "2020-10-07",
          "applicant_state": "Assam",
          "applicant_district": "Dhubri",
          "applicant_pincode": "111111",
          "applicant_currentaddress": "aaaaaaaaaaaaaa",
          "applicant_mobile": "1111111111",
          "applicant_officeno": "1111111111",
          "applicant_desgination": "aaaaaaaaaaaa",
          "applicant_education": "Postgraduate ",
          "applicant_employername": "aaaaaaaaaa",
          "applicant_officeaddress": "aaaaaaaaaaaaaaaaa",
          "applicant_nearestbranch": "Jaipur Office ",
          "applicant_distance": 1110,
          "applicant_acquaintanceid": 1,
          "applicant_maritalstatusid": 2,
          "applicant_casteid": 3,
          "applicant_categoryid": 2,
          "applicant_pan": "QWETY1234O",
          "applicant_aadhar": "222222222230",
        },
        "documentModel": {
          "progress_id": 1,
          "document_id": 7,
          "document_remark": null,
          "document_cibil": 0,
          "document_optional": null,
          "document_aadhar": "222222222230",
          "document_pan": "QWETY1234O"
        },
        "gurantorModel": {
          "gurantor_firstname": "aaaaaaaaaaaa",
          "gurantor_middlename": "",
          "gurantor_lastname": "aaaaaaaaaaa",
          "gurantor_currentaddress": "aaaaaaaaaaaaaaaaaaaa",
          "gurantor_mobile": "1111111111",
          "gurantor_relation": "sffdfd",
          "gurantor_realtedpan": "QWETY1234O",
          "gurantor_realtedaadhar": "222222222230",
          "gurantortype_id": 1
        },
        "loanModel": []
      })
    .expect(200);

  expect(res.body).toBeTruthy();
  expect(res.body).toBeInstanceOf(Object)

  const document = await Document.findAll();
  const gurantor = await Gurantor.findAll();
  const applicant = await Applicant.findAll();
  const account = await Account.findAll();
  const loan = await Loan.findAll();
  const log = await User_kyc_log.findAll();
  const profile = await UserProfile.findAll();

  expect(document.length).toBe(1)
  expect(gurantor.length).toBe(1)
  expect(applicant.length).toBe(1)
  expect(account.length).toBe(1)
  expect(loan.length).toBe(0)
  expect(log.length).toBe(1)
  expect(profile.length).toBe(1)
});

test('CAR | Create (auth) (Server Error)', async () => {

  const res = await request(api)
    .post('/private/CAR/create?user_id=1')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(
      {
        "accountModel": {
          "account_bankname": "cdd",
          "account_ifsc": "1111111111k",
          "account_number": "111111111111",
          "account_inhandsalary": 1111111111,
          "account_realtedpan": "QWETY12341",
          "account_realtedaadhar": "222222222230"
        },
        "applicantModel": {
          "applicant_firstname": "aaaaaaaa",
          "applicant_middlename": "",
          "applicant_lastname": "aaaaaaaaaa",
          "applicant_acquaintancename": "aaaaaaaaaaaa",
          "applicant_dob": "2020-10-07",
          "applicant_state": "Assam",
          "applicant_district": "Dhubri",
          "applicant_pincode": "111111",
          "applicant_currentaddress": "aaaaaaaaaaaaaa",
          "applicant_mobile": "1111111111",
          "applicant_officeno": "1111111111",
          "applicant_desgination": "aaaaaaaaaaaa",
          "applicant_education": "Postgraduate ",
          "applicant_employername": "aaaaaaaaaa",
          "applicant_officeaddress": "aaaaaaaaaaaaaaaaa",
          "applicant_nearestbranch": "Jaipur Office ",
          "applicant_distance": 1110,
          "applicant_acquaintanceid": 1,
          "applicant_maritalstatusid": 2,
          "applicant_casteid": 3,
          "applicant_categoryid": 2,
          "applicant_pan": "QWETY1234O",
          "applicant_aadhar": "222222222230",
        },
        "documentModel": {
          "progress_id": 1,
          "document_id": 7,
          "document_remark": null,
          "document_cibil": 0,
          "document_optional": null,
          "document_aadhar": "222222222230",
          "document_pan": "QWETY1234O"
        },
        "gurantorModel": {
          "gurantor_firstname": "aaaaaaaaaaaa",
          "gurantor_middlename": "",
          "gurantor_lastname": "aaaaaaaaaaa",
          "gurantor_currentaddress": "aaaaaaaaaaaaaaaaaaaa",
          "gurantor_mobile": "1111111111",
          "gurantor_relation": "sffdfd",
          "gurantor_realtedpan": "QWETY1234O",
          "gurantor_realtedaadhar": "222222222230",
          "gurantortype_id": 1
        },
        "loanModel": []
      }).expect(500);
});

// -------------------------------------------------

/**
 * Get By Aadhar Function Tests
 */
test('CAR | Get By Aadhar (auth) (Successful)', async () => {
  const res = await request(api)
    .get('/private/CAR/getForUser?aadhar=222222222230')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);
  // expecting the truthy values 
  expect(res.body).toBeTruthy();
  expect(res.body.documentModel).toBeInstanceOf(Array);
  expect(res.body.gurantorModel).toBeInstanceOf(Array);
  expect(res.body.applicantModel).toBeInstanceOf(Array);
  expect(res.body.accountModel).toBeInstanceOf(Array);
  expect(res.body.loanModel).toBeInstanceOf(Array);
});

test('CAR | Get By Aadhar (auth) (UnSuccessful)', async () => {
  const res = await request(api)
    .get('/private/CAR/getForUser?aadhar=22222222223')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res.body).toBeTruthy();
  expect(res.body.documentModel).toStrictEqual([]);
  expect(res.body.gurantorModel).toStrictEqual([]);
  expect(res.body.applicantModel).toStrictEqual([]);
  expect(res.body.accountModel).toStrictEqual([]);
  expect(res.body.loanModel).toStrictEqual([]);
});

// -------------------------------------------------

/**
 * Get All Aadhar List Function Tests
 */
test('CAR | Get All AadharList (auth) (Successful)', async () => {
  const res = await request(api)
    .get('/private/CAR/getAllAadhar')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res.body).toBeTruthy();
  expect(res.body).toBeInstanceOf(Array)
  expect(res.body).toStrictEqual(['222222222230'])
});
// -------------------------------------------------

/**
 * Get All Pan List Function Tests
 */
test('CAR | Get All PanList (auth) (Successful)', async () => {
  const res = await request(api)
    .get('/private/CAR/getAllPan')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res.body).toBeTruthy();
  expect(res.body).toBeInstanceOf(Array)
  expect(res.body).toStrictEqual(['QWETY1234O'])
});
// -------------------------------------------------

/**
 * Get Firstname with Aadhar Function Tests
 */
test('CAR | Get Firstname with Aadhar (auth) (Successful)', async () => {
  // post request to login 
  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);
  // token verification 
  expect(res.body.token).toBeTruthy();
  // get all firstnames with the Adhaar while Bearer token Authorizing 
  const res2 = await request(api)
    .get('/private/CAR/getFnameWithAadhar')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res2.body).toBeTruthy();
  expect(res2.body).toBeInstanceOf(Array)
  // index of 0 in the body has the bearer token 
  expect(res2.body[0]).toBe('aaaaaaaa : 222222222230')
});
// -------------------------------------------------

/**
 * Get Combobox data Function Tests
 */
test('CAR | Get Combobox data (auth) (Successful)', async () => {
  const res = await request(api)
    .get('/private/CAR/getComboBoxData')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);
  expect(res.body).toBeTruthy();
  expect(res.body).toBeInstanceOf(Object)
  expect(res.body.MaritalStatusModel).toBeTruthy();
  expect(res.body.AcquaintanceModel).toBeTruthy();
  expect(res.body.CasteModel).toBeTruthy();
  expect(res.body.CategoryModel).toBeTruthy();
  expect(res.body.GurantortypeModel).toBeTruthy();
  expect(res.body.LoantypeModel).toBeTruthy();
  expect(res.body.DocumenttypeModel).toBeTruthy();
});
// -------------------------------------------------

/**
 * Get Count of KYC data Function Tests
 */
test('CAR | Get Count of KYC (auth) (Successful)', async () => {
  const k = await User_kyc_log.findAll();
  console.log(k)
  const res = await request(api)
    .get('/private/CAR/getCountOfKyc?user_id=1')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);
  expect(res.body).toStrictEqual({"count":1});
});
  // -------------------------------------------------


