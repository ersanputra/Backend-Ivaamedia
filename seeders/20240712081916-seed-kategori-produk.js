'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('productcategory', [
      {
        name: 'Produk Jadi',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bahan Baku',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Operasional',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('productcategory', null, {});
  }
};
