'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Details', 'sku', {
      type: Sequelize.STRING,
      allowNull: true, // Set allowNull according to your requirement
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Details', 'sku');
  }
};
