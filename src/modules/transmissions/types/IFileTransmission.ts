import { ITransmission } from './ITransmission'

export interface IFileTransmission extends ITransmission {
  uuid: string
  requestUuid: string
  toUuid: string
  fileOriginalName: string
  fileName: string
  filePath: string
  fileMimeType: string
}