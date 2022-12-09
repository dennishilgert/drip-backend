import { inject, injectable } from 'inversify'
import { Socket } from 'socket.io'
import { DisconnectReason } from 'socket.io/dist/socket'
import { IIdentity } from '../../../modules/identity/types'
import { DI_TYPES } from '../diTypes'
import { SocketEvent } from '../enums'
import { ISocketClient, ISocketService } from '../interfaces'
import * as SendingsModule from '../../sendings'
import { container } from '../../../modules/dependencyContainer'

class SocketClient implements ISocketClient {

  private readonly socket: Socket
  private readonly identity: IIdentity
  private readonly socketService: ISocketService
  private readonly sendingService: SendingsModule.interfaces.ISendingService = container.get(SendingsModule.DI_TYPES.SendingService)

  constructor (
    socket: Socket,
    identity: IIdentity,
    socketService: ISocketService
  ) {
    this.socket = socket
    this.identity = identity
    this.socketService = socketService

    this.listen()
  }

  private listen (): void {
    logger.debug('Socket-Client registered')

    this.socket.on(SocketEvent.UPDATED_GEOLOCATION, () => {
      this.socketService.broadcastEvent(SocketEvent.UPDATE_NEARBY_GEOLOCATION, null, [ this.identity.uuid ])
    })

    this.socket.on(SocketEvent.DISCONNECT, (reason: DisconnectReason) => {
      logger.debug('Socket-Client disconnected', reason)

      this.sendingService.cleanFileSendings(this.identity.name)
      this.socketService.destroyClient(this.identity.uuid)
    })
  }

  emitEvent (event: string, data?: string | null, excludes?: string[]): boolean {
    if (this.socket.disconnected) return false
    if (excludes && excludes.includes(this.identity.uuid)) return true
    this.socket.emit(event, data)
    return true
  }

  injectListener (event: string, listener: (...args: any[]) => void): void {
    this.socket.on(event, listener)
  }
}

export default SocketClient