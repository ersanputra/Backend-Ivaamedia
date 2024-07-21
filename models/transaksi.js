'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    static associate(models) {
      Transaksi.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Transaksi.belongsTo(models.Bank, {
        foreignKey: 'bank_id',
        as: 'bank',
      });
      Transaksi.belongsTo(models.KategoriPayment, {
        foreignKey: 'kategori_payment_id',
        as: 'kategoripayment',
      });
    }
  }
  
  Transaksi.init({
    bank_id: DataTypes.INTEGER,
    nomor: DataTypes.STRING,
    nomor_transaksi: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    jumlah: DataTypes.DECIMAL,
    kategori_payment_id: DataTypes.INTEGER,
    tipe: DataTypes.STRING,
    catatan: DataTypes.TEXT,
    bukti_transaksi: DataTypes.STRING,
    status: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaksi',
  });
  
  return Transaksi;
};
