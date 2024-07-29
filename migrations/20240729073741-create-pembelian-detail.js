'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PembelianDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pembelian_id: {
        type: Sequelize.INTEGER
      },
      inventori_id: {
        type: Sequelize.INTEGER
      },
      harga: {
        type: Sequelize.DECIMAL
      },
      satuan: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PembelianDetails');
  }
};