import { Socket } from 'socket.io'
import { ISocketClient } from './ISocketClient'

export interface ISocketService {
  registerClient(socket: Socket, uuid: string): Promise<void>
  getClient(uuid: string): ISocketClient | undefined
  destroyClient(uuid: string): Promise<void>
  emitEvent(uuid: string, event: string, data?: string): boolean
  broadcastEvent(event: string, data?: string | null, excludes?: string[]): void
}
