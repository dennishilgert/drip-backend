import { inject, injectable } from 'inversify'
import { uniqueName } from '../../../common/util/nameUtil'
import { DI_TYPES } from '../diTypes'
import { BadIdentityDeletionDataError, BadIdentityUpdateDataError, IdentityNotFoundError } from '../errors'
import { IIdentityRepo, IIdentityService } from '../interfaces'
import { ICreateIdentityData, IIdentity, IUpdateIdentityData } from '../types'

@injectable()
class IdentityService implements IIdentityService {
  private readonly identityRepo: IIdentityRepo

  public constructor (
    @inject(DI_TYPES.IdentityRepo) identityRepo: IIdentityRepo
  ) {
    this.identityRepo = identityRepo
  }

  /**
   * It creates a new identity in the database with the given parameters
   * @param {ICreateIdentityData} data - ICreateIdentityData
   * @returns An identity object
   */
  async createIdentity (data: ICreateIdentityData): Promise<IIdentity> {
    let name: string = uniqueName()
    while (await this.identityRepo.getByName(name)) {
      name = uniqueName()
    }
    data.name = name
    return this.identityRepo.create(data)
  }

  /**
   * It returns an identity object from the database, or null if it doesn't exist
   * @param {string} uuid - string - The uuid of the identity to retrieve
   * @returns An identity object or null
   */
  async getIdentityByUuid (uuid: string): Promise<IIdentity | null> {
    return this.identityRepo.getByUuid(uuid)
  }

  async getIdentityByName (name: string): Promise<IIdentity | null> {
    return this.identityRepo.getByName(name)
  }

  async validateIdentity (identityName: string): Promise<IIdentity> {
    const identity: IIdentity | null = await this.getIdentityByName(identityName)
    if (!identity) {
      throw new IdentityNotFoundError('Provided identity does not exist')
    }
    return identity
  }

  /**
   * It updates an object in the database with the given parameters and returns the passed in
   * parameters
   * @param {string} uuid - string - The uuid of the identity to update
   * @param {IUpdateIdentityData} data - IUpdateIdentityData
   * @returns The data that was passed in
   */
  async updateIdentity (uuid: string, data: IUpdateIdentityData): Promise<IUpdateIdentityData> {
    const affectedRows: Array<number> = await this.identityRepo.updateByUuid(uuid, data)
    if (!affectedRows[0]) {
      throw new BadIdentityUpdateDataError('Identity update affected 0 rows')
    } else return data
  }

  /**
   * This function deletes an identity from the database
   * @param {string} uuid - string - The uuid of the identity to delete
   * @returns A boolean
   */
  async deleteIdentity (uuid: string): Promise<boolean> {
    const affectedRows: number = await this.identityRepo.deleteByUuid(uuid)
    if (affectedRows < 1) {
      throw new BadIdentityDeletionDataError('Identity deletion affected 0 rows')
    } else return true
  }
}

export default IdentityService
