'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserBusiness extends Model {
    static associate(models) {
      UserBusiness.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      UserBusiness.belongsTo(models.Business, { foreignKey: 'business_id', as: 'business' });
    }
  }

  UserBusiness.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Business',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'UserBusiness',
    timestamps: true // To include createdAt and updatedAt fields
  });

  return UserBusiness;
};
