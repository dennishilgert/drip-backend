/* eslint-disable no-use-before-define */
import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Sequelize } from 'sequelize'
import { uniqueId } from '../../../common/helpers/uuidHelper'
import { IFileTransmission } from '../types'

class FileTransmissionModel
  extends Model<InferAttributes<FileTransmissionModel>, InferCreationAttributes<FileTransmissionModel>>
  implements IFileTransmission {
  declare id: CreationOptional<number>
  declare uuid: string
  declare requestUuid: CreationOptional<string>
  declare fromUuid: string
  declare toUuid: string
  declare fileOriginalName: string
  declare fileName: string
  declare filePath: string
  declare fileMimeType: string

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  FileTransmissionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      requestUuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: () => {
          return uniqueId()
        }
      },
      fromUuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      toUuid: {
        type: DataTypes.STRING(36),
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
      modelName: 'FileTransmission',
      tableName: 'fileTransmissions',
      timestamps: true,
      freezeTableName: true
    }
  )

  return FileTransmissionModel
}
