'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('inventories', 'satuan', {
      type: Sequelize.STRING,
      allowNull: true  // Mengizinkan nilai null sementara
    });

    // Menetapkan nilai default sementara untuk kolom satuan
    await queryInterface.sequelize.query(`
      UPDATE inventories
      SET satuan = 'Pcs'
      WHERE satuan IS NULL;
    `);

    // Mengubah kolom satuan menjadi tidak mengizinkan nilai null
    await queryInterface.changeColumn('inventories', 'satuan', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('inventories', 'satuan');
  }
};
