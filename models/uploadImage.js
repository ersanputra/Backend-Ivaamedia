'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UploadImage extends Model {
    static associate(models) {
      // define association here
      UploadImage.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  UploadImage.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    upload_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'UploadImage',
    tableName: 'upload_images',
    timestamps: false
  });

  return UploadImage;
};
