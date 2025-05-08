'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('PostTags', {
      fields: ['postId'],
      type: 'foreign key',
      name: 'fk_postId',
      references: {
        table: 'Posts',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.addConstraint('PostTags', {
      fields: ['tagId'],
      type: 'foreign key',
      name: 'fk_tagId',
      references: {
        table: 'Tags',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('PostTags', 'fk_postId');
    await queryInterface.removeConstraint('PostTags', 'fk_tagId');
  }
};