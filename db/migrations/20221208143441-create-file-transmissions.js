'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('fileTransmissions', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      uuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false
      },
      requestUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false
      },
      fromUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false
      },
      toUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false
      },
      fileOriginalName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      fileName: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false
      },
      filePath: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      fileMimeType: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down (queryInterface) {
    return queryInterface.dropTable('fileTransmissions')
  }
}
