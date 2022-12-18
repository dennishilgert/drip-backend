import { ISocketRequest, ISocketResponse } from '../types'

export interface ISocketClient {
  openRequest (request: ISocketRequest): Promise<ISocketResponse>
  closeRequest (requestUuid: string): void
  emitEvent (event: string, data?: string | null, excludes?: string[]): boolean
  injectListener (event: string, listener: (...args: any[]) => void): void
  removeListener (event: string, listener: (...args: any[]) => void): void
}