'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pembelian extends Model {
    static associate(models) {
      Pembelian.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Pembelian.belongsTo(models.Seller, {
        foreignKey: 'seller_id',
        as: 'seller',
      });
      Pembelian.hasMany(models.PembelianDetail, {
        foreignKey: 'pembelian_id',
        as: 'details',
      });
      Pembelian.belongsTo(models.ProductCategory, {
        foreignKey: 'product_category_id',
        as: 'productCategory',
      });
    }
  }
  Pembelian.init({
    user_id: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    seller_id: DataTypes.INTEGER,
    product_category_id: DataTypes.INTEGER,
    metode_pembelian: DataTypes.STRING,
    pembayaran: DataTypes.STRING,
    ongkir: DataTypes.DECIMAL,
    diskon: DataTypes.DECIMAL,
    total: DataTypes.DECIMAL,
    bukti_pembayaran: DataTypes.STRING,
    bukti_pembelian: DataTypes.STRING,
    harga_total: DataTypes.DECIMAL,
    status_pesanan: DataTypes.STRING,
    catatan: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Pembelian',
  });
  return Pembelian;
};
