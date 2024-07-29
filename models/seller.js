'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    static associate(models) {
      Seller.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Seller.hasMany(models.Pembelian, {
        foreignKey: 'seller_id',
        as: 'pembelians',
      });
    }
  }
  Seller.init({
    seller: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Seller',
  });
  return Seller;
};
