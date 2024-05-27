'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gallery extends Model {
    static associate({ otherGallery }) {
      this.hasMany(otherGallery, {
        foreignKey: 'galleryId',
        as: 'another',
      });
    }
  }
  Gallery.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name_tm: {
        type: DataTypes.STRING,
      },
      name_ru: {
        type: DataTypes.STRING,
      },
      name_en: {
        type: DataTypes.STRING,
      },
      img: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'galleries',
      modelName: 'Gallery',
    }
  );
  return Gallery;
};
