import { ICreateIdentityData, IIdentity, IUpdateIdentityData } from '../types'

export interface IIdentityService {
  createIdentity (data: ICreateIdentityData): Promise<IIdentity>
  getIdentityByUuid (uuid: string): Promise<IIdentity | null>
  getIdentityByName (name: string): Promise<IIdentity | null>
  validateIdentity (identityName: string): Promise<IIdentity>
  updateIdentity (uuid: string, data: IUpdateIdentityData): Promise<IUpdateIdentityData>
  deleteIdentity (uuid: string): Promise<boolean>
}