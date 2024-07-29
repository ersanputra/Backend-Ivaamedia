'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PembelianDetail extends Model {
    static associate(models) {
      PembelianDetail.belongsTo(models.Pembelian, {
        foreignKey: 'pembelian_id',
        as: 'pembelian',
      });
      PembelianDetail.belongsTo(models.Inventory, {
        foreignKey: 'inventori_id',
        as: 'inventory',
      });
    }
  }
  PembelianDetail.init({
    pembelian_id: DataTypes.INTEGER,
    inventori_id: DataTypes.INTEGER,
    harga: DataTypes.DECIMAL,
    satuan: DataTypes.STRING,
    nama: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'PembelianDetail',
  });
  return PembelianDetail;
};
