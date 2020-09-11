const {
  beforeAction,
  afterAction,
} = require('../setup/_setup');
const User = require('../../api/models/User');

let user;

beforeAll(async () => {
  await beforeAction();
});

afterAll(() => {
  afterAction();
});

beforeEach(async () => {
  user = await User.create({
    "full_name": "Rime",
    "username": "rime",
    "designation": "Boss",
    "user_mobile": "8299213792",
    "password": "Alfanzo@001",
    "password2": "Alfanzo@001",
    "permissions": {"Admin": true, "Employee": false},
    "is_active": true
});
});

test('User is created correctly', async () => {
  const sendUser = user.toJSON();
  // check if user is created
  expect(user.username).toBe('rime');
  // check if password is not send to browser
  expect(sendUser.password).toBeFalsy();

  await user.destroy();
});

test('User is updated correctly', async () => {
  await user.update({
    username: 'peter@mail.com',
  });

  expect(user.username).toBe('peter@mail.com');

  await user.destroy();
});
