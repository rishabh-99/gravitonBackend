const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(login) {
    login.password = bcryptService().password(login); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'login';

const Login = sequelize.define('login',
{
  user_id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  full_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true
  },
  designation: {
    type: Sequelize.STRING,
    allowNull: true
  },
  user_mobile: {
    type: Sequelize.STRING,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true
  },
  permissions: {
    type: Sequelize.JSON,
    allowNull: true
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
}, { hooks, tableName, timestamps: false, });

// eslint-disable-next-line
Login.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = Login;