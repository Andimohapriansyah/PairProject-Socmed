'use strict';
const fs = require('fs').promises;

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile('./data/posts.json', { encoding: 'utf8' })).map(el => ({
      ...el,
      createdAt: new Date(el.createdAt),
      updatedAt: new Date(el.updatedAt),
    }));
    await queryInterface.bulkInsert('Posts', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  }
};