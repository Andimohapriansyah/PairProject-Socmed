'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    static associate(models) {
      // Define associations if needed
    }
  }

  PostTag.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  }, {
    sequelize,
    modelName: 'PostTag',
    uniqueKeys: {
      posttag_unique: {
        fields: ['postId', 'tagId']
      }
    }
  });
  return PostTag;
};