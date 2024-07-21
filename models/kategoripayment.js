'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KategoriPayment extends Model {
    static associate(models) {
      KategoriPayment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  KategoriPayment.init({
    tipe: DataTypes.STRING,
    nama: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'KategoriPayment',
    tableName: 'kategoripayment'
  });
  return KategoriPayment;
};
