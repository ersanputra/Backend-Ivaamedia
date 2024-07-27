'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      Business.belongsToMany(models.User, {
        through: 'UserBusiness',
        foreignKey: 'business_id',
        as: 'users'
      });
    }
  }

  Business.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Business',
  });

  return Business;
};
