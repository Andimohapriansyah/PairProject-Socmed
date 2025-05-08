'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' });
      Post.belongsToMany(models.Tag, { through: models.PostTag, foreignKey: 'postId' });
    }

    static async findAllPosts(search, order) {
      const { Op } = require('sequelize');
      const { User, Tag } = require('../models');
      let options = {
        include: [
          { model: User, attributes: ['email'] },
          { model: Tag, attributes: ['name'] }
        ],
        attributes: ['id', 'title', 'content', 'imgUrl', 'userId', 'createdAt']
      };
      if (order) options.order = [[order, 'DESC']];
      if (search) options.where = { title: { [Op.iLike]: `%${search}%` } };
      let data = await Post.findAll(options);
      return data;
    }

    get formattedImgUrl() {
      return this.imgUrl || "https://via.placeholder.com/100";
    }
  }

  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title required!" },
        notEmpty: { msg: "Title required!" }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Content required!" },
        notEmpty: { msg: "Content required!" }
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Image URL required!" },
        notEmpty: { msg: "Image URL required!" },
        isUrl: { msg: "Must be a valid URL!" }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};