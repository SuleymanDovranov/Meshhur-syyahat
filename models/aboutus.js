'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AboutUs extends Model {
    static associate(models) {}
  }
  AboutUs.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    },
    {
      sequelize,
      tableName: 'aboutus',
      modelName: 'AboutUs',
    }
  );
  return AboutUs;
};
