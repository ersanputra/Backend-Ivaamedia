'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      Business.hasMany(models.User, {
        foreignKey: 'business_id',
        as: 'users',
      });
    }
  }
  Business.init({
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Business',
  });
  return Business;
};
