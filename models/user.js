'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'userId' });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Email required!" },
        notEmpty: { msg: "Email required!" },
        isEmail: { msg: "Must be a valid email format!" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password required!" },
        notEmpty: { msg: "Password required!" },
        len: {
          args: [8],
          msg: "Password must be at least 8 characters!"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Role required!" },
        notEmpty: { msg: "Role required!" },
        isIn: {
          args: [['user', 'admin']],
          msg: "Role must be 'user' or 'admin'!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  return User;
};