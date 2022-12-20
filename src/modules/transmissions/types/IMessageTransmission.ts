import { ITransmission } from './ITransmission'

export interface IMessageTransmission extends ITransmission {
	uuid: string
	requestUuid: string
	toUuid: string
	message: string
}
