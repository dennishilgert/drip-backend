import { ICreateFileTransmissionData, IFileTransmission } from '../types'

export interface IFileTransmissionRepo {
  create (createTransmission: ICreateFileTransmissionData): Promise<IFileTransmission>
  getByUuid (uuid: string, scopes?: string[]): Promise<IFileTransmission | null>
  getByRequestUuid (requestUuid: string, scopes?: string[]): Promise<IFileTransmission | null>
  getByToUuid (toUuid: string, scopes?: string[]): Promise<IFileTransmission[]>
  deleteByUuid (uuid: string): Promise<number>
  deleteByRequestUuid (requestUuid: string): Promise<number>
}