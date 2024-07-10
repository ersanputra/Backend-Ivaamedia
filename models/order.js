'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Order.belongsTo(models.Business, { foreignKey: 'business_id', as: 'business' });
      Order.belongsTo(models.Marketplace, { foreignKey: 'marketplace_id', as: 'marketplace' });
      Order.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
      Order.belongsTo(models.Detail, { foreignKey: 'details_id', as: 'detail' });
      Order.belongsTo(models.Address, { foreignKey: 'address_id', as: 'address' });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    business_id: DataTypes.INTEGER,
    marketplace_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING,
    order_number: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    details_id: DataTypes.INTEGER,
    address_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    courier: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    tracking_number: DataTypes.STRING,
    notes: DataTypes.TEXT,
    order_date: DataTypes.DATE,
    shipping_cost: DataTypes.DECIMAL(10, 2),
    product_price: DataTypes.DECIMAL(10, 2),
    gross_amount: DataTypes.DECIMAL(10, 2),
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
