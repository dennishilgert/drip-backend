import { injectable } from 'inversify'
import { IIdentityRepo } from '../interfaces'
import { ICreateIdentityData, IIdentity, IUpdateIdentityData } from '../types'
import database from '../../databaseModels'
import { Op } from 'sequelize'

@injectable()
class IdentityRepo implements IIdentityRepo {
  /**
   * It creates a new identity in the database
   * @param {ICreateIdentityData} createIdentity - ICreateIdentityData
   * @returns The newly created identity
   */
  async create(createIdentity: ICreateIdentityData): Promise<IIdentity> {
    return database.Identity.create(createIdentity)
  }

  /**
   * It returns a single Identity record from the database, based on the criteria you pass in
   * @param {object} criteria - object
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query
   * @returns An Identity object
   */
  async getOneByCriteria(criteria: object, scopes?: string[] | false): Promise<IIdentity | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Identity.scope(definedScopes).findOne(parameters)
    }
    return database.Identity.unscoped().findOne(parameters)
  }

  async getByUuid(uuid: string, scopes?: string[]): Promise<IIdentity | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  async getByName(name: string, scopes?: string[]): Promise<IIdentity | null> {
    return this.getOneByCriteria({ name }, scopes)
  }

  /**
   * It returns multiple Identity records from the database, based on the criteria you pass in
   * @param {object} criteria - object
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query
   * @returns An array of Identity object
   */
  async getManyByCriteria(criteria: object, scopes?: string[] | false): Promise<IIdentity[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Identity.scope(definedScopes).findAll(parameters)
    }
    return database.Identity.unscoped().findAll(parameters)
  }

  async getByIp(ip: string): Promise<IIdentity[]> {
    return this.getManyByCriteria({ ip })
  }

  async getWithLocation(): Promise<IIdentity[]> {
    return this.getManyByCriteria({
      longitude: {
        [Op.ne]: null
      }
    })
  }

  /**
   * It updates the database with the given updates, where the criteria is met
   * @param {object} criteria - object - The criteria to use to find the identity
   * @param {object} updates - The object containing the fields to update
   * @returns The number of rows affected
   */
  async update(criteria: object, updates: object): Promise<Array<number>> {
    return database.Identity.update(updates, {
      where: criteria
    })
  }

  async updateByUuid(uuid: string, updates: IUpdateIdentityData): Promise<Array<number>> {
    return this.update({ uuid }, updates)
  }

  /**
   * It deletes a record from the database based on the criteria passed in
   * @param {object} criteria - object - This is the criteria that will be used to find the record(s)
   * to delete
   * @returns The number of rows deleted
   */
  async delete(criteria: object): Promise<number> {
    return database.Identity.destroy({
      where: criteria
    })
  }

  async deleteByUuid(uuid: string): Promise<number> {
    return this.delete({ uuid })
  }
}

export default IdentityRepo
