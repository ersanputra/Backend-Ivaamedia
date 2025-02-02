'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Konfirmasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Konfirmasi.init({
    user_id: DataTypes.INTEGER,
    transaksi_id: DataTypes.INTEGER,
    acc_time: DataTypes.DATE,
    acc_file: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Konfirmasi',
  });
  return Konfirmasi;
};