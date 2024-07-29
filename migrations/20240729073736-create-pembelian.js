'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pembelians', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      product_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'productcategories', // Nama tabel yang dirujuk
          key: 'id',
        },
        allowNull: false,
      },
      tanggal: {
        type: Sequelize.DATE
      },
      seller_id: {
        type: Sequelize.INTEGER
      },
      metode_pembelian: {
        type: Sequelize.STRING
      },
      pembayaran: {
        type: Sequelize.STRING
      },
      ongkir: {
        type: Sequelize.DECIMAL
      },
      diskon: {
        type: Sequelize.DECIMAL
      },
      total: {
        type: Sequelize.DECIMAL
      },
      bukti_pembayaran: {
        type: Sequelize.STRING
      },
      bukti_pembelian: {
        type: Sequelize.STRING
      },
      harga_total: {
        type: Sequelize.DECIMAL
      },
      status_pesanan: {
        type: Sequelize.STRING
      },
      catatan: {
        type: Sequelize.TEXT
      },
      active: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Pembelians');
  }
};