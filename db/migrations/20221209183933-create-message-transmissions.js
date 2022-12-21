'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('messageTransmissions', {
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
      message: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface) {
    return queryInterface.dropTable('messageTransmissions')
  }
}
