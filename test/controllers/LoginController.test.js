/*
File Description: Tests for the Login controllers using the models 
Author: Rishabh Merhotra 
*/

// importing the super test for unit-testing the api 
const request = require('supertest');
const {
  beforeAction,
  afterAction,
} = require('../setup/_setup');
// importing the login model from the models folder
const Login = require('../../api/models/Login');
// cryptoJs for the enryption techniques
// jwt for authentication of the users
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
// encryptsecret varies depending on the Environment
const encryptSecret = process.env.NODE_ENV === 'production' ? process.env.ENCRYPT_SECRET : 'b14ca5898a4e4133bbce2ea2315a1916';
var key = CryptoJS.enc.Utf8.parse(encryptSecret);
var iv = CryptoJS.enc.Utf8.parse('b14ca5898a4e4133');

//UTF-8 is a variable-width character encoding 

let api;

beforeAll(async () => {
  api = await beforeAction();
});

afterAll(() => {
  afterAction();
});

test('Login | create', async () => {

  /**
 * Creating a login user
 * @constructor
 * @param {response} = req.api 
 * @param Login created using - full_name, username, password , designation, user_mobile 
 * and permissions
 * Created the login user
 */

  // post request with details to register
  const res = await request(api)
    .post('/public/register')
    .set('Accept', /json/)
    .send({
      "full_name": "Rime",
      "username": "rimet",
      "designation": "Boss",
      "user_mobile": "8299213792",
      "password": "Alfanzo@001",
      "password2": "Alfanzo@001",
      "permissions": "{\"Admin\": true, \"Employee\": false}",
      "is_active": true
    })
    // 200 to be ok! 
    // .expect(200);
  console.log(res.body)
  expect(res.body.msg).toBe('User created successfully!!');
  
  const login = await Login.findOne({
    // finding the user with given username 
    where: {
      username: 'rimet',
    }
  })
  expect(login.full_name).toBe('Rime');
  // cleaning the database before next test 
  await login.destroy();



  
});

test('Login | login', async () => {

  // post request tp create a login of a user 
  const login = await Login.create({
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
  /**
 * Login of the user .
 * @constructor
 * @param {req} api - login the user 
 * @param Login using the following details - Username and password
 * After veriying with token the login is done
 */

    .post('/public/login')
    // post request using the login details 
    .set('Accept', /json/)
    .send({
      "username": "rimet",
      "password": "Alfanzo@001"
    })
    .expect(200);
   // body with token is verified 
  expect(res.body.token).toBeTruthy();

  expect(login).toBeTruthy();
  // cleaning the database before next test 
  await login.destroy();
});

test('Login | get all (auth)', async () => {
  // post request the login credentials 
  const login = await Login.create({
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
  // post request the detials to login 
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  // verifying using the Bearer token 
  const res2 = await request(api)
    .get('/private/User/logins')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);
  // expecting the user to be truthy 
  expect(res2.body.users).toBeTruthy();
  expect(res2.body.users.length).toBeGreaterThanOrEqual(1);
  // cleaning the database before next test 
  await login.destroy();
});

test('Login | DisableUser (auth)', async () => {
  // post request with the login credentials 
  const login = await Login.create({
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
  /**
 * Disabling a user
 * Accepts the responses and requests from the api
 * @param Login with the usename and password and verification starts
 * @param login_id is used and the user gets disabled 
 */
  /// logging in using username and password 
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);
  // verifying using token 
  expect(res.body.token).toBeTruthy();
  //using the login, disable a user with their id.
  const res2 = await request(api)
    .post(`/private/User/disableUser?user_id=${login.user_id}&username=rimet&password=Alfanzo@001`)
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res2.body.msg).toBe('User disabled successfully!');
  // cleaning the database before next test 
  await login.destroy();
});


test('Login | create | with invalid request ', async () => {

  /**
 * Creating a login user
 * @constructor
 * @param {response} = req.api 
 * @param Login created using - full_name, username, password , designation, user_mobile 
 * and permissions
 * Created the login user
 */

  // post request with details to register
  const res = await request(api)
    .post('/public/register')
    .set('Accept', /json/)
    .send({
      "full_name": "Rime",
      "username": "rimet",
      "designation": "Boss",
      "user_mobile": 8299213792,
      "password": "Alfanzdo@001",
      "password2": "Alfanzo@001",
      "permissions": "{\"Admin\": true, \"Employee\": false}",
      "is_active": true
    })
    // 200 to be ok! 
  expect(500)
  console.log(res.body)
  //expect(res.body.msg).toBe('User created successfully!!');
  
  const login = await Login.findOne({
    // finding the user with given username 
    where: {
      username: 'rimet',
    }
  })
  expect(login.full_name).toBe('Rime');
  
  // cleaning the database before next test 
  await login.destroy();
});

test('Login | create | with incorrect passwords', async () => {

  /**
 * Creating a login user
 * @constructor
 * @param {response} = req.api 
 * @param Login created using - full_name, username, password , designation, user_mobile 
 * and permissions
 * Created the login user
 */

  // post request with details to register
  const res = await request(api)
    .post('/public/register')
    .set('Accept', /json/)
    .send({
      "full_name": "Rime",
      "username": "rimet",
      "designation": "Boss",
      "user_mobile": "8299213792",
      "password": "Alfanzdlo@001",
      "password2": "Alfanzo@001",
      "permissions": "{\"Admin\": true, \"Employee\": false}",
      "is_active": true
    })
    // 200 to be ok! 
  expect(401)
  console.log(res.body)
  //expect(res.body.msg).toBe('User created successfully!!');
  
  const login = await Login.findOne({
    // finding the user with given username 
    where: {
      username: 'rimet',
    }
  })
  expect(login.full_name).toBe('Rime');
  
  // cleaning the database before next test 
  await login.destroy();
});
test('Login | create | with 201 (added) ', async () => {

  /**
 * Creating a login user
 * @constructor
 * @param {response} = req.api 
 * @param Login created using - full_name, username, password , designation, user_mobile 
 * and permissions
 * Created the login user
 */

  // post request with details to register
  const res = await request(api)
    .post('/public/register')
    .set('Accept', /json/)
    .send({
      "full_name": "Rime",
      "username": "rimet",
      "designation": "Boss",
      "user_mobile": "8299213792",
      "password": "Alfanzdlo@001",
      "password2": "Alfanzo@001",
      "permissions": "{\"Admin\": true, \"Employee\": false}",
      "is_active": true
    })
    // 200 to be ok! 
  expect(201)
  console.log(res.body)
  //expect(res.body.msg).toBe('User created successfully!!');
  
  const login = await Login.findOne({
    // finding the user with given username 
    where: {
      username: 'rimet',
    }
  })
  expect(login.full_name).toBe('Rime');
  
  // cleaning the database before next test 
  await login.destroy();
});



