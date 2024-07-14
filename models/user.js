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
      User.hasMany(models.ProductCategory, {
        foreignKey: 'user_id',
        as: 'productcategory',
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
