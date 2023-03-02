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
      state: {
        type: Sequelize.DataTypes.TINYINT,
        allowNull: false
      },
      longitude: Sequelize.DataTypes.DECIMAL(12, 9),
      latitude: Sequelize.DataTypes.DECIMAL(12, 9),
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface) {
    return queryInterface.dropTable('identities')
  }
}
