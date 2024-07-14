'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('location', [
      {
        name: 'Gudang A',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gudang B',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('location', null, {});
  }
};
