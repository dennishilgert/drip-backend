import { Socket } from 'socket.io'
import { DisconnectReason } from 'socket.io/dist/socket'
import { IIdentity } from '../../../modules/identity/types'
import { SocketEvent } from '../enums'
import { ISocketClient, ISocketService } from '../interfaces'
import * as TransmissionsModule from '../../transmissions'
import * as IdentityModule from '../../identity'
import { container } from '../../../modules/dependencyContainer'
import SocketRequest from './socketRequest'
import { ISocketRequest, ISocketResponse, ITransformedSocketRequest } from '../types'
import RequestSocketTransformer from '../transformers/requestSocketTransformer'
import { InternalError } from '../../../errors'

class SocketClient implements ISocketClient {
  private readonly socket: Socket
  private readonly identity: IIdentity
  private timeout: NodeJS.Timeout | null
  private readonly socketService: ISocketService
  private readonly transmissionService: TransmissionsModule.interfaces.ITransmissionService = container.get(
    TransmissionsModule.DI_TYPES.TransmissionService
  )

  private readonly identityService: IdentityModule.interfaces.IIdentityService = container.get(
    IdentityModule.DI_TYPES.IdentityService
  )

  private pendingRequests: Map<string, SocketRequest>

  constructor(
    socket: Socket,
    identity: IIdentity,
    pendingRequests: Map<string, SocketRequest>,
    socketService: ISocketService
  ) {
    this.socket = socket
    this.identity = identity
    this.pendingRequests = pendingRequests
    this.timeout = null
    this.socketService = socketService

    this.listen()
  }

  private listen(): void {
    logger.debug('Socket-Client registered')
    this.identityService.updateIdentity(this.identity.uuid, {
      state: IdentityModule.enums.IdentityState.CONNECTED
    })

    this.socket.on(SocketEvent.UPDATED_GEOLOCATION, () => {
      this.socketService.broadcastEvent(SocketEvent.UPDATE_NEARBY_GEOLOCATION, null, [this.identity.uuid])
    })

    this.socket.on(SocketEvent.DISCONNECT, (reason: DisconnectReason) => {
      logger.debug('Socket-Client disconnected', reason)

      this.identityService.updateIdentity(this.identity.uuid, {
        state: IdentityModule.enums.IdentityState.DISCONNECTED
      })

      this.socketService.broadcastEvent(SocketEvent.UPDATE_NEARBY_IP)
      this.socketService.broadcastEvent(SocketEvent.UPDATE_NEARBY_GEOLOCATION)
      this.initTermination()
    })
  }

  initTermination(): void {
    // Destroy the identity after three hours
    this.timeout = setTimeout(() => {
      this.transmissionService.cleanMessageTransmissions(this.identity.uuid)
      this.transmissionService.cleanFileTransmissions(this.identity.uuid)
      this.socketService.destroyClient(this.identity.uuid)
    }, 1000 * 60 * 60 * 3)
  }

  cancelTermination(): void {
    if (!this.timeout) return
    clearTimeout(this.timeout)
    this.timeout = null
  }

  async openRequest(request: ISocketRequest): Promise<ISocketResponse> {
    const transformedRequest: ITransformedSocketRequest = new RequestSocketTransformer(request).transform()
    const eventEmitted: boolean = this.emitEvent(SocketEvent.REQUEST, JSON.stringify(transformedRequest))
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

  getPendingRequests(): Map<string, SocketRequest> {
    return this.pendingRequests
  }
}

export default SocketClient
