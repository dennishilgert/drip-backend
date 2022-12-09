import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, DataTypes, Sequelize } from 'sequelize'
import { IFileSending } from '../types'


class FileSendingModel extends Model<InferAttributes<FileSendingModel>, InferCreationAttributes<FileSendingModel>> implements IFileSending {
  declare id: CreationOptional<number>
  declare uuid: string
  declare fromName: string
  declare toName: string
  declare fileOriginalName: string
  declare fileName: string
  declare filePath: string
  declare fileMimeType: string

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  FileSendingModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      fromName: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      toName: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      fileOriginalName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileName: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileMimeType: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'FileSending',
      tableName: 'fileSendings',
      timestamps: true,
      freezeTableName: true
    }
  )

  return FileSendingModel
}