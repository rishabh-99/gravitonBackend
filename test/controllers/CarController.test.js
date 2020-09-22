const request = require('supertest');
const {
  beforeAction,
  afterAction,
} = require('../setup/_setup');

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


const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

let api;
let login

beforeAll(async () => {
  api = await beforeAction();

  login = await Login.create({
    "full_name": "Rime",
    "username": "rimet",
    "designation": "Boss",
    "user_mobile": "8299213792",
    "password": "Alfanzo@001",
    "password2": "Alfanzo@001",
    "permissions": "{\"Admin\": true, \"Employee\": false}",
    "is_active": true
  });
});

afterAll(async () => {
  await login.destroy();

  afterAction();
});

test('CAR | Create (auth)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  const res2 = await request(api)
    .post('/private/CAR/create')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .send({
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
        "DisplaySearch": "aaaaaaaa   :   222222222227"
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

  expect(res2.body.msg).toBeTruthy();
  expect(res2.body.msg).toBe('CAR created Successfully');


});

test('CAR | Get By Aadhar (auth)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  const res2 = await request(api)
    .get('/private/CAR/getForUser?aadhar=222222222230')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

    expect(res2.body).toBeTruthy();
    expect(res2.body.documentModel).toBeTruthy();
    expect(res2.body.gurantorModel).toBeTruthy();
    expect(res2.body.applicantModel).toBeTruthy();
    expect(res2.body.accountModel).toBeTruthy();
    expect(res2.body.loanModel).toBeTruthy();


});

test('CAR | Get All AadharList (auth)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  const res2 = await request(api)
    .get('/private/CAR/getAllAadhar')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

    expect(res2.body).toBeTruthy();
    expect(res2.body).toBeInstanceOf(Array)


});

test('CAR | Get All PanList (auth)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  const res2 = await request(api)
    .get('/private/CAR/getAllPan')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

    expect(res2.body).toBeTruthy();
    expect(res2.body).toBeInstanceOf(Array)


});

test('CAR | Get Firstname with Aadhar (auth)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  const res2 = await request(api)
    .get('/private/CAR/getFnameWithAadhar')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

    expect(res2.body).toBeTruthy();
    expect(res2.body).toBeInstanceOf(Array)
    expect(res2.body[0]).toBe('aaaaaaaa : 222222222230')
});

test('CAR | Get Combobox data (auth)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  const res2 = await request(api)
    .get('/private/CAR/getComboBoxData')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

    expect(res2.body).toBeTruthy();
    expect(res2.body).toBeInstanceOf(Object)
    expect(res2.body.MaritalStatusModel).toBeTruthy();
    expect(res2.body.AcquaintanceModel).toBeTruthy();
    expect(res2.body.CasteModel).toBeTruthy();
    expect(res2.body.CategoryModel).toBeTruthy();
    expect(res2.body.GurantortypeModel).toBeTruthy();
    expect(res2.body.LoantypeModel).toBeTruthy();
    expect(res2.body.DocumenttypeModel).toBeTruthy();
    // expect(res2.body[0]).toBe('aaaaaaaa : 222222222230')
});



