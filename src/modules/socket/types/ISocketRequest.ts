import { RequestType } from '../enums'

export interface ISocketRequest {
  requestType: RequestType
  requestUuid: string
  fromUuid: string
  toUuid: string
}
