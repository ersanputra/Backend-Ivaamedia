'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business',
      });
      User.hasMany(models.Inventory, {
        foreignKey: 'user_id',
        as: 'inventories',
      });
      User.hasMany(models.Location, {
        foreignKey: 'user_id',
        as: 'locations',
      });
      User.hasMany(models.UploadImage, {
        foreignKey: 'user_id',
        as: 'upload_images',
      });
      User.hasMany(models.KategoriPayment, {
        foreignKey: 'user_id',
        as: 'kategoripayment',
      });
      User.hasMany(models.Bank, {
        foreignKey: 'user_id',
        as: 'bank',
      });
      User.hasMany(models.Transaksi, {
        foreignKey: 'user_id',
        as: 'transaksis',
      });
    }
  }

  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    full_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    role: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    business_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};
