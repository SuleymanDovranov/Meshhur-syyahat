'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('tours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('tours');
  },
};
