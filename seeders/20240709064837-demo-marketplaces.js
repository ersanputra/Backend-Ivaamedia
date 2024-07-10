'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Marketplaces', [
      {
        name: 'SHOPEE',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TOKOPEDIA',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TIKTOK',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Marketplaces', null, {});
  }
};
