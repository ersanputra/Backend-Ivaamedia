'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      Inventory.belongsTo(models.ProductCategory, {
        foreignKey: 'product_category_id',
        as: 'productCategory',
      });
      Inventory.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'location',
      });
      Inventory.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Inventory.init({
    product_category_id: DataTypes.INTEGER,
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    hpp: DataTypes.DECIMAL,
    product_photo: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    location_id: DataTypes.INTEGER,
    selling_price: DataTypes.DECIMAL,
    inventory_value: DataTypes.DECIMAL,
    user_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Inventory',
    tableName: 'inventories',
  });
  return Inventory;
};
