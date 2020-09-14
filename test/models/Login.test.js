const {
  beforeAction,
  afterAction,
} = require('../setup/_setup');
const Login = require('../../api/models/Login');

let login;

beforeAll(async () => {
  await beforeAction();
});

afterAll(() => {
  afterAction();
});

beforeEach(async () => {
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
  await login.update({
    username: 'peter@mail.com',
  });

  expect(login.username).toBe('peter@mail.com');

  await login.destroy();
});
