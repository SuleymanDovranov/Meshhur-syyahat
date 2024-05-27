'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class otherGallery extends Model {
    static associate({ Gallery }) {
      this.belongsTo(Gallery, {
        foreignKey: 'galleryId',
        as: 'other',
      });
    }
  }
  otherGallery.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      img: {
        type: DataTypes.STRING,
      },
      galleryId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: 'othergalleries',
      modelName: 'otherGallery',
    }
  );
  return otherGallery;
};
