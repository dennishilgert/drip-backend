import { IDatabaseModel } from '../../../common/interfaces'

export interface IIdentity extends IDatabaseModel {
  uuid: string
  name: string
  ip: string,
  longitude: number,
  latitude: number
}