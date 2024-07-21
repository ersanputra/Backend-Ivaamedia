'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transaksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bank_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'bank',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      nomor: {
        type: Sequelize.STRING
      },
      nomor_transaksi: {
        type: Sequelize.STRING
      },
      tanggal: {
        type: Sequelize.DATE
      },
      jumlah: {
        type: Sequelize.DECIMAL(10, 2)
      },
      kategori_payment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'kategoripayment',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tipe: {
        type: Sequelize.STRING
      },
      catatan: {
        type: Sequelize.TEXT
      },
      bukti_transaksi: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transaksis');
  }
};
