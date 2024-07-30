'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PembelianDetails', 'jumlah', {
      type: Sequelize.INTEGER,
      allowNull: false,  // Set to true if you want to allow null values
      defaultValue: 1    // You can set a default value if needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PembelianDetails', 'jumlah');
  }
};
