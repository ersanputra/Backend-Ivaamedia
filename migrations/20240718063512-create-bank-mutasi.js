'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BankMutasis', {
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
      tanggal: {
        type: Sequelize.DATE
      },
      tipe: {
        type: Sequelize.ENUM('Kredit', 'Debit')
      },
      jumlah: {
        type: Sequelize.DECIMAL(10, 2)
      },
      catatan: {
        type: Sequelize.TEXT
      },
      transaksi_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Transaksis',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      saldo: {
        type: Sequelize.DECIMAL(10, 2)
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
    await queryInterface.dropTable('BankMutasis');
  }
};
