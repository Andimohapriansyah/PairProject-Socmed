'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {foreignKey: 'userId'})
      Post.belongsToMany(models.Tag, {through: models.PostTag, foreignKey: 'postId'})
      // define association here
    }

    static async findAllPosts(search, order){
      try {
        let options = {
          include: [User, Tag],
          attributes: ['id', 'title', 'content', 'imgUrl', 'userId'],
        }

        if(order){
          options.order = [[order, 'DESC']]
        }

        if(search){
          options.where = {
            title: {
              [Op.iLike]: `%${search}%`
            }
          }
        }

        let data = await Post.findAll(options)
        return data
      } catch (error) {
        throw error
      }
    }

    get formattedImgUrl(){
      return this.imgUrl || "http://example.com/default.jpg"
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title required!"
        },
        notEmpty: {
          mgs: "Title required!"
        }
      }
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Content required!"
        },
        notEmpty: {
          msg: "Content required!"
        }
      }
    },

    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image URL required!"
        },
        notEmpty: {
          msg: "Image URL required!"
        },
        isUrl: {
          msg: "Must be a valid URL!"
        }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};