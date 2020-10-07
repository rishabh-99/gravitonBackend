/*
File Description: Tests for the Login  using the models 
Author: Rishabh Merhotra 
*/

const {
  // importing the actions from the setup file
  beforeAction,
  afterAction,
} = require('../setup/_setup');

// importing the login model from models folder
const Login = require('../../api/models/Login');

let login;

beforeAll(async () => {
  await beforeAction();
});

afterAll(() => {
  afterAction();
});

beforeEach(async () => {
  // before each of the test, we create a user using login credentials 
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

test('Login is created correctly', async () => {
  const sendLogin = login.toJSON();
  // check if login is created
  expect(login.username).toBe('rimet');
  // check if password is not send to browser
  expect(sendLogin.password).toBeFalsy();

  await login.destroy();
});

test('Login is updated correctly', async () => {
  // updating the user with the username
  await login.update({
    username: 'peter@mail.com',
  });

  expect(login.username).toBe('peter@mail.com');
  // cleaning the database before next test 

  await login.destroy();
});
