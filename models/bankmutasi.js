'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankMutasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      BankMutasi.belongsTo(models.Bank, {
        foreignKey: 'bank_id',
        as: 'bank'
      });
      BankMutasi.belongsTo(models.Transaksi, {
        foreignKey: 'transaksi_id',
        as: 'transaksi'
      });
    }
  }
  BankMutasi.init({
    bank_id: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    tipe: DataTypes.ENUM('Kredit', 'Debit'),
    jumlah: DataTypes.DECIMAL(10, 2),
    catatan: DataTypes.TEXT,
    transaksi_id: DataTypes.INTEGER,
    saldo: DataTypes.DECIMAL(10, 2),
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'BankMutasi',
  });
  return BankMutasi;
};
