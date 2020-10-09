/*
File DEscription: Creating a login controller to perform Authentications 
Author: Rishabh Merhotra
logs: 07/10/2020 - Added joi validation
*/
// Importing the models from the model folder 
const User = require('../models/Login');
// importing the servcies from the folder 
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

// Importing the joi validation Schema from joi_validation folder

const {loginSchema } = require('../joi_validation/joi_validation_login_controller')
// Defining a login controller 
const LoginController = () => {
/**
 * Regestering a user 
 * @Accepts the request and responses
 * @param {req} body - in the form of req.body
 * @param user is created using, fullname, username, designation,
 * user_mobile,  password, permissions, and active status
 * User- Created
 */

  const register = async (req, res) => {
    // registering the user 
    const { body } = req; 
    const result = Joi.validate(body, loginSchema); 
    const { value, error } = result; 
    const valid = error == null; 
    if (!valid) { 
      res.status(422).json({ 
        message: 'Invalid request', 
        data: body 
      }) 
    } else { 
    // req.body 
            try {
    

      // creating a user with parameters given 
      const user = await User.create({
        full_name: body.full_name,
        username: body.username,
        designation: body.designation,
        user_mobile: body.user_mobile,
        password: body.password,
        permissions: JSON.parse(body.permissions),
        is_active: body.is_active
      });
      // validating using joi Schema 

      // 200 ok! 
      return res.status(200).json({ msg: 'User created successfully!!' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  // login function accepts both the request and responses 
/**
 * login a user.
 * @constructor Loggin in accepts a request and response
 * @param {req} body - 
 * @login require username and password
 */

  const login = async (req, res) => {
    const { username, password } = req.body;
  // we find username entered in the database to verify 
    if (username && password) {
      try {
        const user = await User
          .findOne({
            where: {
              username,
              is_active: true
            },
          });
        if (!user) {
          return res.status(400).json({ msg: 'Bad Request: User not found' });
        }
         // we comapre the password with the existing password to make a token 
        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({
            user_id: user.user_id,
            full_name: user.full_name,
            username: user.username,
            designation: user.designation,
            user_mobile: user.user_mobile,
            permissions: JSON.stringify(user.permissions),
            is_active: user.is_active
          });

          return res.status(200).json({ token });
        }

        return res.status(401).json({ msg: 'Unauthorized' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
  };

  // validating the user with the token 
  const validate = (req, res) => {
    const { token } = req.body;
/**
 * Validating a user 
 * @constructor-verification accepts a req and response with token
 * @param {req} body  - request in the form req.body
 * @param token verification
 */
    authService().verify(token, (err) => {
      // we verify the token with exisitng password to proceed 
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const getAll = async (req, res) => {
  /**
 * Getting all users.
 * @constructor findAll
 * @param {req} body - is in the form req.body and accepts requests and responses
 * @param finding all the acrive user with where condition
 */

    try {
      // gets all the users who are active
      const users = await User.findAll({
        where: {
          is_active: true
        }
      });

      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const disableUser = async (req, res) => {
    try {
/**
 * Disabling a user.
 * @constructor
 * @param {req} query - accepts a user request and responses
 * @param {username, password}  query- finding the user and disabling them .
 */


      // this disables the user from the database
      const username = req.query.username;
      const password = req.query.password;

      const admin = await User
        .findOne({
          // with a condition 
          where: {
            username,
            is_active: true
          },
        });
      if (!admin) {
        return res.status(400).json({ msg: 'Bad Request: Admin not found' });
      }
     // using becrypt to compare the password with the adimn.password
      if (bcryptService().comparePassword(password, admin.password)) {
        const user_id = req.query.user_id
       // using id we update to "False"
        const user = await User.findByPk(user_id)
        await user.update({
          is_active: false
        })

        return res.status(200).json({ msg: 'User disabled successfully!' });
      }

      return res.status(401).json({ msg: 'Unauthorized' });
    } catch (err) {

      res.status(500).json({ msg: err })
    }
  };

 // returns all the functions from login Controller
  return {
    register,
    login,
    validate,
    getAll,
    disableUser
  };
};
// exporting the whole Module
}
module.exports = LoginController
