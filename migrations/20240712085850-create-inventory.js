'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'productcategories', // refers to table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      sku: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      hpp: {
        type: Sequelize.DECIMAL
      },
      product_photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations', // refers to table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      selling_price: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      inventory_value: {
        type: Sequelize.DECIMAL
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // refers to table name
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
    await queryInterface.dropTable('inventories');
  }
};
