'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Header extends Model {
    static associate({ Headerimg }) {
      this.hasMany(Headerimg, {
        foreignKey: 'headerId',
        as: 'imgs',
      });
    }
  }
  Header.init(
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
      tableName: 'header',
      modelName: 'Header',
    }
  );
  return Header;
};
