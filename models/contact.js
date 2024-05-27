'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {}
  }
  Contact.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      adress: {
        type: DataTypes.STRING,
      },
      telNum: {
        type: DataTypes.TEXT,
      },
      whatNum: {
        type: DataTypes.TEXT,
      },
      teleNum: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.STRING,
      },
      header_tm: {
        type: DataTypes.STRING,
      },
      header_en: {
        type: DataTypes.STRING,
      },
      header_ru: {
        type: DataTypes.STRING,
      },
      desc_tm: {
        type: DataTypes.STRING,
      },
      desc_en: {
        type: DataTypes.STRING,
      },
      desc_ru: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'contact',
      modelName: 'Contact',
    }
  );
  return Contact;
};
