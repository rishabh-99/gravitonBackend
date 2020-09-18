const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'category';

const Category = sequelize.define('category',
{
    category_id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { tableName, timestamps: false, });

// eslint-disable-next-line
Category.removeAttribute('id');

module.exports = Category;
