import SocketRequest from '../objects/socketRequest'
import { ISocketRequest, ISocketResponse } from '../types'

export interface ISocketClient {
  initTermination(): void
  cancelTermination(): void
  openRequest(request: ISocketRequest): Promise<ISocketResponse>
  closeRequest(requestUuid: string): void
  emitEvent(event: string, data?: string | null, excludes?: string[]): boolean
  injectListener(event: string, listener: (...args: any[]) => void): void
  removeListener(event: string, listener: (...args: any[]) => void): void
  getPendingRequests(): Map<string, SocketRequest>
}
