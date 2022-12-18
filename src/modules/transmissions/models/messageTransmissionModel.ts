import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { uniqueId } from '../../../common/helpers/uuidHelper'
import { IMessageTransmission } from '../types'

class MessageTransmissionModel extends Model<InferAttributes<MessageTransmissionModel>, InferCreationAttributes<MessageTransmissionModel>> implements IMessageTransmission {
  declare id: CreationOptional<number>
  declare uuid: string
  declare requestUuid: CreationOptional<string>
  declare fromUuid: string
  declare toUuid: string
  declare message: string

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  MessageTransmissionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: () => {
          return uniqueId()
        }
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
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'MessageTransmission',
      tableName: 'messageTransmissions',
      timestamps: true,
      freezeTableName: true
    }
  )

  return MessageTransmissionModel
}