import { IFileSendingRepo } from '../interfaces'
import { ICreateFileSendingData, IFileSending } from '../types'
import database from '../../databaseModels'
import { injectable } from 'inversify'
import { Op } from 'sequelize'

@injectable()
class FileSendingRepo implements IFileSendingRepo {

  /**
   * It creates a new file sending in the database
   * @param {ICreateFileSendingData} createSending - ICreateFileSendingData
   * @returns A promise of a FileSending object
   */
  async create (createSending: ICreateFileSendingData): Promise<IFileSending> {
    return database.FileSending.create(createSending)
  }

  /**
   * It returns a single FileSending record from the database, based on the criteria you pass in
   * @param {object} criteria - object
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query
   * @returns An FileSending object
   */
   async getOneByCriteria (criteria: object, scopes?: string[] | false): Promise<IFileSending | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.FileSending.scope(definedScopes).findOne(parameters)
    }
    return database.FileSending.unscoped().findOne(parameters)
  }

  async getByUuid (uuid: string, scopes?: string[]): Promise<IFileSending | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  /**
   * It returns multiple FileSending records from the database, based on the criteria you pass in
   * @param {object} criteria - object
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query
   * @returns An array of FileSending object
   */
   async getManyByCriteria (criteria: object, scopes?: string[] | false): Promise<IFileSending[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.FileSending.scope(definedScopes).findAll(parameters)
    }
    return database.FileSending.unscoped().findAll(parameters)
  }

  async getByToName (toName: string, scopes?: string[]): Promise<IFileSending[]> {
    return this.getManyByCriteria({ toName }, scopes)
  }

  /**
   * It deletes a record from the database based on the criteria passed in
   * @param {object} criteria - object - This is the criteria that will be used to find the record(s)
   * to delete
   * @returns The number of rows deleted
   */
   async delete (criteria: object): Promise<number> {
    return database.FileSending.destroy({
      where: criteria
    })
  }

  async deleteByUuid (uuid: string): Promise<number> {
    return this.delete({ uuid })
  }
}

export default FileSendingRepo