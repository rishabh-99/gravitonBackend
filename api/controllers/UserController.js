const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;

      try {
        const user = await User.create({
          full_name: body.full_name,
          username: body.username,
          designation: body.designation,
          user_mobile: body.user_mobile,
          password: body.password,
          permissions: body.permissions,
          is_active: body.is_active
        });
        const token = authService().issue({
          id: user.id,
          full_name: user.full_name,
          username: user.username,
          designation: user.designation,
          user_mobile: user.user_mobile,
          permissions: user.permissions,
          is_active: user.is_active
        });

        return res.status(200).json({ token });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
  };

  const login = async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
      try {
        const user = await User
          .findOne({
            where: {
              username,
            },
          });

        if (!user) {
          return res.status(400).json({ msg: 'Bad Request: User not found' });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({
            id: user.id,
            full_name: user.full_name,
            username: user.username,
            designation: user.designation,
            user_mobile: user.user_mobile,
            permissions: user.permissions,
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

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, (err) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };


  return {
    register,
    login,
    validate,
    getAll,
  };
};

module.exports = UserController;
