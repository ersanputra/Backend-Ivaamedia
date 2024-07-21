'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    static associate(models) {
      Bank.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Bank.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    nama_bank: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomor_rekening: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pemilik_rekening: {
      type: DataTypes.STRING,
      allowNull: false
    },
    saldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Bank',
    tableName: 'bank'
  });
  return Bank;
};
