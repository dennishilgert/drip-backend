import { injectable } from 'inversify'
import { IMessageTransmissionRepo } from '../interfaces'
import database from '../../databaseModels'
import { ICreateMessageTransmissionData, IMessageTransmission } from '../types'

@injectable()
class MessageTransmissionRepo implements IMessageTransmissionRepo {
  async create (
    createTransmission: ICreateMessageTransmissionData
  ): Promise<IMessageTransmission> {
    return database.MessageTransmission.create(createTransmission)
  }

  async getOneByCriteria (
    criteria: object,
    scopes?: string[] | false
  ): Promise<IMessageTransmission | null> {
    const definedScopes =
      scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.MessageTransmission.scope(definedScopes).findOne(
        parameters
      )
    }
    return database.MessageTransmission.unscoped().findOne(parameters)
  }

  async getByUuid (
    uuid: string,
    scopes?: string[]
  ): Promise<IMessageTransmission | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  async getManyByCriteria (
    criteria: object,
    scopes?: string[] | false
  ): Promise<IMessageTransmission[]> {
    const definedScopes =
      scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.MessageTransmission.scope(definedScopes).findAll(
        parameters
      )
    }
    return database.MessageTransmission.unscoped().findAll(parameters)
  }

  async getByToUuid (
    toUuid: string,
    scopes?: string[]
  ): Promise<IMessageTransmission[]> {
    return this.getManyByCriteria({ toUuid }, scopes)
  }

  async delete (criteria: object): Promise<number> {
    return database.MessageTransmission.destroy({
      where: criteria
    })
  }

  async deleteByUuid (uuid: string): Promise<number> {
    return this.delete({ uuid })
  }

  async deleteByRequestUuid (requestUuid: string): Promise<number> {
    return this.delete({ requestUuid })
  }

  async deleteByToUuid (toUuid: string): Promise<number> {
    return this.delete({ toUuid })
  }
}

export default MessageTransmissionRepo
