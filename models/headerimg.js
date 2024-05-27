'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Headerimg extends Model {
    static associate({ Header }) {
      this.belongsTo(Header, {
        foreignKey: 'headerId',
        as: 'header',
      });
    }
  }
  Headerimg.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      img: {
        type: DataTypes.STRING,
      },
      headerId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: 'headerimg',
      modelName: 'Headerimg',
    }
  );
  return Headerimg;
};
