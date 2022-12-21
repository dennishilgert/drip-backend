'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('identities', {
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
      name: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false
      },
      ip: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false
      },
      longitude: Sequelize.DataTypes.NUMBER,
      latitude: Sequelize.DataTypes.NUMBER,
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down (queryInterface) {
    return queryInterface.dropTable('identities')
  }
}
