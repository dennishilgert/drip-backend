import { SendingType } from '../enums'

export interface ISendingRequest {
  fromName: string
  type: SendingType
  fileOriginalName?: string
  fileMimeType?: string
}