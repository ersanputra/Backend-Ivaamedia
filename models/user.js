'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
      User.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business',
      });
      User.belongsToMany(models.Business, {
        through: 'UserBusiness',
        foreignKey: 'user_id',
        as: 'businesses',
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100] // Minimum 8 characters
      }
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    phone_number: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
        len: [10, 15] // Adjust as necessary for your requirements
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['ADMIN', 'USER', 'manager']] // Example roles
      }
    },
    profile_image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true // Ensure it is a valid URL
      }
    },
    business_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Business',
        key: 'id'
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
