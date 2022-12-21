/* eslint-disable no-use-before-define */
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  DataTypes,
  Sequelize
} from 'sequelize'
import { uniqueId } from '../../../common/helpers/uuidHelper'
import { IIdentity } from '../types'

class IdentityModel
  extends Model<InferAttributes<IdentityModel>, InferCreationAttributes<IdentityModel>>
  implements IIdentity
{
  declare id: CreationOptional<number>
  declare uuid: string
  declare name: string
  declare ip: string
  declare longitude: CreationOptional<number>
  declare latitude: CreationOptional<number>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  get displayName(): NonAttribute<string> {
    return this.name
  }
}

export default function (sequelize: Sequelize) {
  IdentityModel.init(
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
      name: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      ip: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      longitude: DataTypes.NUMBER,
      latitude: DataTypes.NUMBER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Identity',
      tableName: 'identities',
      timestamps: true,
      freezeTableName: true
    }
  )

  return IdentityModel
}
