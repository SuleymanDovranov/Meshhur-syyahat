'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {
    static associate(models) {}
  }
  Services.init(
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
      desc_tm: {
        type: DataTypes.TEXT,
      },
      desc_en: {
        type: DataTypes.TEXT,
      },
      desc_ru: {
        type: DataTypes.TEXT,
      },
      img: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'services',
      modelName: 'Services',
    }
  );
  return Services;
};
