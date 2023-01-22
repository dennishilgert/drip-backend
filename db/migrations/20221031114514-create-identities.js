'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('identities', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      uuid: {
        type: Sequelize.DataTypes.STRING(36),
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.STRING(64),
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      ip: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false
      },
      longitude: Sequelize.DataTypes.INTEGER,
      latitude: Sequelize.DataTypes.INTEGER,
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface) {
    return queryInterface.dropTable('identities')
  }
}
