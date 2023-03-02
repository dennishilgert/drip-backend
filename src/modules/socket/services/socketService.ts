import { inject, injectable } from 'inversify'
import { ISocketClient, ISocketService } from '../interfaces'
import * as IdentityModule from '../../identity'
import { Socket } from 'socket.io'
import SocketClient from '../objects/socketClient'
import { SocketEvent } from '../enums'
import SocketRequest from '../objects/socketRequest'

@injectable()
class SocketService implements ISocketService {
  private readonly identityService: IdentityModule.interfaces.IIdentityService
  private clients: Map<string, ISocketClient>

  constructor(
    @inject(IdentityModule.DI_TYPES.IdentityService) identityService: IdentityModule.interfaces.IIdentityService
  ) {
    this.identityService = identityService
    this.clients = new Map()
  }

  async registerClient(socket: Socket, uuid: string): Promise<void> {
    const identity: IdentityModule.types.IIdentity | null = await this.identityService.getIdentityByUuid(uuid)
    if (!identity) {
      socket.disconnect(true)
      logger.debug('Socket-Client identified itself with invalid identity - connection closed')
      return
    }
    let pendingRequests: Map<string, SocketRequest> = new Map<string, SocketRequest>()
    const existingSocketClient: ISocketClient | undefined = this.clients.get(uuid)
    if (existingSocketClient) {
      pendingRequests = existingSocketClient.getPendingRequests()
      existingSocketClient.cancelTermination()
    }
    this.clients.set(uuid, new SocketClient(socket, identity, pendingRequests, this))
    this.broadcastEvent(SocketEvent.UPDATE_NEARBY_IP, null, [uuid])
  }

  getClient(uuid: string): ISocketClient | undefined {
    return this.clients.get(uuid)
  }

  async destroyClient(uuid: string): Promise<void> {
    this.clients.delete(uuid)
    logger.debug('Socket-Client destroyed')

    if (!(await this.identityService.deleteIdentity(uuid))) {
      logger.error('Cannot delete identity associated to closed socket')
    }
  }

  emitEvent(uuid: string, event: string, data?: string): boolean {
    const socketClient: ISocketClient | undefined = this.getClient(uuid)
    if (!socketClient) return false
    return socketClient.emitEvent(event, data)
  }

  broadcastEvent(event: string, data?: string | null, excludes?: string[]): void {
    this.clients.forEach((socketClient: ISocketClient) => {
      socketClient.emitEvent(event, data, excludes)
    })
  }
}

export default SocketService
