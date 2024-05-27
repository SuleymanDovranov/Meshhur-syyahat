'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tours extends Model {
    static associate(models) {}
  }
  Tours.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      loc_tm: {
        type: DataTypes.STRING,
      },
      loc_ru: {
        type: DataTypes.STRING,
      },
      loc_en: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.STRING,
      },
      persons: {
        type: DataTypes.STRING,
      },
      desc_tm: {
        type: DataTypes.TEXT,
      },
      desc_ru: {
        type: DataTypes.TEXT,
      },
      desc_en: {
        type: DataTypes.TEXT,
      },
      img: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'tours',
      modelName: 'Tours',
    }
  );
  return Tours;
};
