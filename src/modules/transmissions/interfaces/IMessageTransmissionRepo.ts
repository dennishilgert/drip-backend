import { ICreateMessageTransmissionData, IMessageTransmission } from '../types'

export interface IMessageTransmissionRepo {
  create(createTransmission: ICreateMessageTransmissionData): Promise<IMessageTransmission>
  getByUuid(uuid: string, scopes?: string[]): Promise<IMessageTransmission | null>
  getByToUuid(toUuid: string, scopes?: string[]): Promise<IMessageTransmission[]>
  deleteByUuid(uuid: string): Promise<number>
  deleteByRequestUuid(requestUuid: string): Promise<number>
  deleteByToUuid(toUuid: string): Promise<number>
}
