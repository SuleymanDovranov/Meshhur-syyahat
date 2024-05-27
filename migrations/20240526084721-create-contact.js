'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('contact', {
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
    await queryInterface.dropTable('contact');
  },
};
