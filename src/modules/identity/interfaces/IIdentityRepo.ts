import { ICreateIdentityData, IIdentity, IUpdateIdentityData } from '../types'

export interface IIdentityRepo {
  create(createIdentity: ICreateIdentityData): Promise<IIdentity>
  getByUuid(uuid: string, scopes?: string[]): Promise<IIdentity | null>
  getByName(name: string, scopes?: string[]): Promise<IIdentity | null>
  getByIp(ip: string, scopes?: string[]): Promise<IIdentity[]>
  getWithLocation(scopes?: string[]): Promise<IIdentity[]>
  updateByUuid(uuid: string, updates: IUpdateIdentityData): Promise<Array<number>>
  deleteByUuid(uuid: string): Promise<number>
}
