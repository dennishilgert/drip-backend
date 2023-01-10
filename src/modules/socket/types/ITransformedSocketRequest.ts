import { RequestType } from '../enums'

export interface ITransformedSocketRequest {
  requestType: RequestType
  requestUuid: string
}
