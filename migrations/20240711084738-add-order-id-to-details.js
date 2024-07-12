'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Details', 'order_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Orders', // name of Target model
        key: 'id', // key in Target model
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Details', 'order_id');
  }
};
