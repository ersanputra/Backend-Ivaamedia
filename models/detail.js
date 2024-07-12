'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    static associate(models) {
      Detail.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' }); // Add this line
    }
  }
  Detail.init({
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    order_id: DataTypes.INTEGER // Add this line
  }, {
    sequelize,
    modelName: 'Detail',
  });
  return Detail;
};
