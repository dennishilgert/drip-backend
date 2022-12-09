import { Request } from 'express'
import { IFileSending } from '../types'

export interface ISendingService {
  sendMessage (fromName: string, toName: string, text: string): Promise<boolean>
  sendFile (fromName: string, req: Request): Promise<boolean>
  getFileSendingByUuid (uuid: string): Promise<IFileSending | null>
  cleanFileSendings (identityName: string): Promise<void>
  deleteFileSending (uuid: string): Promise<number>
  deleteFile (path: string): Promise<void>
}