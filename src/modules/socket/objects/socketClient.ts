import { Socket } from 'socket.io'
import { DisconnectReason } from 'socket.io/dist/socket'
import { IIdentity } from '../../../modules/identity/types'
import { SocketEvent } from '../enums'
import { ISocketClient, ISocketService } from '../interfaces'
import * as TransmissionsModule from '../../transmissions'
import { container } from '../../../modules/dependencyContainer'
import SocketRequest from './socketRequest'
import {
	ISocketRequest,
	ISocketResponse,
	ITransformedSocketRequest
} from '../types'
import RequestSocketTransformer from '../transformers/requestSocketTransformer'
import { InternalError } from '../../../errors'

class SocketClient implements ISocketClient {
	private readonly socket: Socket
	private readonly identity: IIdentity
	private readonly socketService: ISocketService
	private readonly transmissionService: TransmissionsModule.interfaces.ITransmissionService =
		container.get(TransmissionsModule.DI_TYPES.TransmissionService)

	private pendingRequests: Map<string, SocketRequest> = new Map<
		string,
		SocketRequest
	>()

	constructor(
		socket: Socket,
		identity: IIdentity,
		socketService: ISocketService
	) {
		this.socket = socket
		this.identity = identity
		this.socketService = socketService

		this.listen()
	}

	private listen(): void {
		logger.debug('Socket-Client registered')

		this.socket.on(SocketEvent.UPDATED_GEOLOCATION, () => {
			this.socketService.broadcastEvent(
				SocketEvent.UPDATE_NEARBY_GEOLOCATION,
				null,
				[this.identity.uuid]
			)
		})

		this.socket.on(SocketEvent.DISCONNECT, (reason: DisconnectReason) => {
			logger.debug('Socket-Client disconnected', reason)

			this.transmissionService.cleanMessageTransmissions(this.identity.uuid)
			this.transmissionService.cleanFileTransmissions(this.identity.uuid)
			this.socketService.destroyClient(this.identity.uuid)
		})
	}

	async openRequest(request: ISocketRequest): Promise<ISocketResponse> {
		const transformedRequest: ITransformedSocketRequest =
			new RequestSocketTransformer(request).transform()
		const eventEmitted: boolean = this.emitEvent(
			SocketEvent.REQUEST,
			JSON.stringify(transformedRequest)
		)
		if (!eventEmitted) {
			throw new InternalError('Failed to emit event on client')
		}
		const socketRequest: SocketRequest = new SocketRequest(this, request)
		this.pendingRequests.set(request.requestUuid, socketRequest)
		return socketRequest.listenForResponse()
	}

	closeRequest(requestUuid: string): void {
		if (this.pendingRequests.has(requestUuid)) {
			this.pendingRequests.delete(requestUuid)
		}
	}

	emitEvent(event: string, data?: string | null, excludes?: string[]): boolean {
		if (this.socket.disconnected) return false
		if (excludes && excludes.includes(this.identity.uuid)) return true
		this.socket.emit(event, data)
		return true
	}

	injectListener(event: string, listener: (...args: any[]) => void): void {
		this.socket.on(event, listener)
	}

	removeListener(event: string, listener: (...args: any[]) => void): void {
		this.socket.removeListener(event, listener)
	}
}

export default SocketClient
