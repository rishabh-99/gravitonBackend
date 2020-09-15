const request = require('supertest');
const {
  beforeAction,
  afterAction,
} = require('../setup/_setup');
const Login = require('../../api/models/Login');

const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

const encryptSecret = process.env.NODE_ENV === 'production' ? process.env.ENCRYPT_SECRET : 'b14ca5898a4e4133bbce2ea2315a1916';
var key = CryptoJS.enc.Utf8.parse(encryptSecret);
var iv = CryptoJS.enc.Utf8.parse('b14ca5898a4e4133');


let api;

beforeAll(async () => {
  api = await beforeAction();
});

afterAll(() => {
  afterAction();
});

test('Login | create', async () => {
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
    .expect(200);
  console.log(res.body)
  expect(res.body.token).toBeTruthy();

  const payload = JSON.parse(CryptoJS.AES.decrypt(jwt.decode(res.body.token).encryptedPayload, key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8));
  console.log(payload)
  console.log(payload)
  const login = await Login.findOne({
    where: {
      username: payload.username,
    }
  })
  expect(login.user_id).toBe(payload.user_id);
  expect(login.username).toBe(payload.username);

  await login.destroy();
});

test('Login | login', async () => {
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
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      "username": "rimet",
      "password": "Alfanzo@001"
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  expect(login).toBeTruthy();

  await login.destroy();
});

test('Login | get all (auth)', async () => {
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
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      username: 'rimet',
      password: 'Alfanzo@001',
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  const res2 = await request(api)
    .get('/private/logins')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res2.body.users).toBeTruthy();
  expect(res2.body.users.length).toBe(1);

  await login.destroy();
});
