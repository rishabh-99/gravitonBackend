/*
File Description: Tests for the endpoints in Login Controller
Author: Rishabh Mehrotra 
*/

/**
 * Library Imports
 */
const request = require('supertest');
const CryptoJS = require("crypto-js");

/**
 * Self defined Imports
 */
const { beforeAction, afterAction } = require('../setup/_setup');
const Login = require('../../api/models/Login');

let api;
let token;
let admin;

beforeAll(async () => {
  api = await beforeAction();
});

afterAll(() => {
  afterAction();
});
 
console.log(`%c--------------------------------------------------
Login Controller Tests
--------------------------------------------------`,'background: #222; color: #bada55');
/**
 * Register Function Tests
 */
test('Login | create (Successful)', async () => {

  const res = await request(api)
    .post('/public/register')
    .set('Accept', /json/)
    .send({
      "full_name": "Rishabh Mehrotra",
      "username": "rishabh",
      "designation": "Boss",
      "user_mobile": "8299213792",
      "password": "Alfanzo@001",
      "password2": "Alfanzo@001",
      "permissions": "{\"Admin\": true, \"Employee\": false}",
      "is_active": true
    }).expect(200)
  expect(res.body.msg).toBe('User created successfully!!');

  const login = await Login.findOne({
    where: {
      username: 'rishabh',
    }
  })
  admin = login;
  expect(login.full_name).toBe('Rishabh Mehrotra');

  // const ress = await Login.destroy({
  //   where: {
  //     username: 'rishabh',
  //   }
  // });

});

test('Login | create (Unsuccessful)', async () => {

  const res = await request(api)
    .post('/public/register')
    .set('Accept', /json/)
    .send({
      "full_name": "Rishabh Mehrotra",
      "username": "rishabh2",
      "designation": "Boss",
      "user_mobile": "8299213792",
      "password": "Alfanzo@001",
      "password2": "Alfanzo@001",
      "permissions": "{Admin\": true, \"Employee\": false}",
      "is_active": true
    }).expect(500)

  const login = await Login.findOne({
    where: {
      username: 'rishabh2',
    }
  })
  expect(login).toBe(null);
});

// -------------------------------------------------

/**
 * Login Function Tests
 */
test('Login | login (Successful)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      "username": "rishabh",
      "password": "Alfanzo@001"
    }).expect(200)

  expect(res.body.token).toBeTruthy();
  token = res.body.token;
});

test('Login | login (User Not Found)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      "username": "rishabh2",
      "password": "Alfanzo@001"
    }).expect(400)

  expect(res.body.msg).toBe('Bad Request: User not found');
});

test('Login | login (Unauthorized)', async () => {

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      "username": "rishabh",
      "password": "Alfanzo@00"
    }).expect(401)

  expect(res.body.msg).toBe('Unauthorized');
});

// -------------------------------------------------

/**
 * GetAll Function Tests
 */

test('Login | getAll (Successfull)', async () => {

  const res = await request(api)
    .get('/private/User/logins')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200)

  expect(res.body.users).toBeTruthy();
});

// -------------------------------------------------

/**
 * GetAccessKeys Function Tests
 */
test('Login | GetAccessKeys (Successfull)', async () => {

  const res = await request(api)
    .get('/private/Security/getInkredoAccessKeys')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200)

  expect(res.body.access_id).toBeTruthy();
  expect(res.body.access_key).toBeTruthy();
});

// -------------------------------------------------

/**
 * DisableUser Function Tests
 */
test('Login | DisableUser (Unauthorized)', async () => {
  const res = await request(api)
    .post('/private/User/disableUser')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .query({
      username: 'rishabh',
      password: 'Alfanzo@00',
      user_id: admin.user_id
    })
    .expect(401)
  expect(res.body.msg).toBe('Unauthorized')
});

test('Login | DisableUser (Successfull)', async () => {
  const res = await request(api)
    .post('/private/User/disableUser')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .query({
      username: 'rishabh',
      password: 'Alfanzo@001',
      user_id: admin.user_id
    })
    .expect(200)
  expect(res.body.msg).toBe('User disabled successfully!')

  const user = await Login.findByPk(admin.user_id);
  expect(user.is_active).toBe(false)
});

test('Login | DisableUser (Bad Request: Admin not found)', async () => {
  const res = await request(api)
    .post('/private/User/disableUser')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .query({
      username: 'rishabh2',
      password: 'Alfanzo@001',
      user_id: admin.user_id
    })
    .expect(400)

  expect(res.body.msg).toBe('Bad Request: Admin not found')
});

// -------------------------------------------------
