/**
 * This File is a part of Graviton.
 * (c) 2019 Kugelblitz Technologies LLP
 * 
 * ---------------------------------------
 * 
 * @module LoginController
 * @author Rishabh Mehrotra <mehrotra.rishab@gmail.com>
 */

/**
 * Imports
 */
const User = require('../models/Login');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const sequelize = require('../../config/database');

const LoginController = () => {

  const register = async (req, res) => {

    const { body } = req;

    try {
      /**
* Registering a User
* @description register
* @param {string} body.full_name - Fullname of the User to be created
* @param {string} body.username - Username of the User to be created
* @param {string} body.designation - designation of the User to be created
* @param {string} body.user_mobile - Mobile Number of the User to be created
* @param {string} body.password - Password of the User to be created
* @param {string} body.permissions - Permissions of the User to be created
* @param {boolean} body.is_active - Permissions of the User to be created
*/
      const user = await User.create({
        full_name: body.full_name,
        username: body.username,
        designation: body.designation,
        user_mobile: body.user_mobile,
        password: body.password,
        permissions: JSON.parse(body.permissions),
        is_active: body.is_active
      });


      // 200 ok! 
      return res.status(200).json({ msg: 'User created successfully!!' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }

  };

  // login function accepts both the request and responses 
  /**
   * login a user.
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
        /* istanbul ignore next */
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
  };
  /* istanbul ignore next */
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
      var today = new Date();
      var dd = today.getDate();

      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }

      // today = dd + '-' + mm + '-' + yyyy;
      today = yyyy + '-' + mm + '-' + dd;
      const users = await sequelize.query(`SELECT login.user_id, full_name, username, designation, user_mobile, permissions, is_active, count(u.user_id)
      FROM (public.login
      left join (select * from user_kyc_log where kyc_date = '${today}') as u on login.user_id = u.user_id) where login.is_active = true  group by (login.user_id) ;`)

      return res.status(200).json({ users: users[0] });
    } catch (err) {
      /* istanbul ignore next */
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const disableUser = async (req, res) => {
    try {




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
      /* istanbul ignore next */
      return res.status(500).json({ msg: err })
    }
  };

  const getAccessKeys = async (req, res) => {
    try {

      const access_id = '5f67a59fdf25606eb13ade1e';
      const access_key = '005c81366d1bd668580392f299b676f0d2cc69b2b53e107f841be2fbcc1a4893'

      return res.status(200).json({ access_id, access_key });
    } catch (err) {
      /* istanbul ignore next */
      res.status(500).json({ msg: err })
    }
  };


  // returns all the functions from login Controller
  return {
    register,
    login,
    validate,
    getAll,
    disableUser,
    getAccessKeys
  };
};
// exporting the whole Module

module.exports = LoginController
