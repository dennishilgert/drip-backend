import * as SocketModule from '../../socket'

export interface ITransmissionRequest
	extends SocketModule.types.ISocketRequest {
	transmissionUuid: string
	fromName: string
	fileOriginalName?: string
	fileMimeType?: string
}
