import { Request } from 'express'
import { IFileTransmission, IMessageTransmission, ITransmissionRequest } from '../types'

export interface ITransmissionService {
  cacheMessage(fromName: string, toName: string, message: string): Promise<IMessageTransmission>
  cacheFile(fromUuid: string, toUuid: string, request: Request): Promise<IFileTransmission>
  sendRequest(toUuid: string, transmissionRequest: ITransmissionRequest): void
  getMessageTransmissionByUuid(uuid: string): Promise<IMessageTransmission | null>
  getFileTransmissionByUuid(uuid: string): Promise<IFileTransmission | null>
  cleanMessageTransmissions(identityUuid: string): Promise<void>
  cleanFileTransmissions(identityName: string): Promise<void>
  deleteMessageTransmission(requestUuid: string): Promise<number>
  deleteFileTransmission(requestUuid: string): Promise<number>
}
