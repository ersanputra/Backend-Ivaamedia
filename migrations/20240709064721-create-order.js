'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      business_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Businesses',
          key: 'id'
        }
      },
      marketplace_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Marketplaces',
          key: 'id'
        }
      },
      order_id: {
        type: Sequelize.STRING
      },
      order_number: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id'
        }
      },
      details_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Details',
          key: 'id'
        }
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Addresses',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING
      },
      courier: {
        type: Sequelize.STRING
      },
      payment_method: {
        type: Sequelize.STRING
      },
      tracking_number: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.TEXT
      },
      order_date: {
        type: Sequelize.DATE
      },
      shipping_cost: {
        type: Sequelize.DECIMAL(10, 2)
      },
      product_price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      gross_amount: {
        type: Sequelize.DECIMAL(10, 2)
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
    await queryInterface.dropTable('Orders');
  }
};
