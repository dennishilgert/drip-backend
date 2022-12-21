import { asNumber } from '../../../common/helpers/dataHelper'
import { SocketEvent } from '../enums'
import { SocketRequestTimeoutError } from '../errors'
import { ISocketClient } from '../interfaces'
import { ISocketRequest, ISocketResponse } from '../types'

class SocketRequest {
  private readonly socketClient: ISocketClient
  readonly requestUuid: string
  readonly fromUuid: string
  readonly toUuid: string

  constructor (socketClient: ISocketClient, request: ISocketRequest) {
    this.socketClient = socketClient
    this.requestUuid = request.requestUuid
    this.fromUuid = request.fromUuid
    this.toUuid = request.toUuid
  }

  async listenForResponse (): Promise<ISocketResponse> {
    return new Promise<ISocketResponse>(
      (resolve: (socketResponse: ISocketResponse) => void, reject: (error: Error) => void) => {
        const listener: (...args: any[]) => void = (data: string) => {
          const socketResponse: ISocketResponse = JSON.parse(data)
          if (socketResponse.requestUuid === this.requestUuid) {
            clearTimeout(timeout)
            this.closeRequest(listener)
            return resolve(socketResponse)
          }
        }
        const timeoutCallback: () => void = () => {
          this.closeRequest(listener)
          return reject(new SocketRequestTimeoutError('Socket Request timed out'))
        }
        const timeout: NodeJS.Timeout = setTimeout(timeoutCallback, asNumber(process.env.SOCKET_REQUEST_TIMEOUT))
        this.socketClient.injectListener(SocketEvent.RESPONSE, listener)
      }
    )
  }

  private closeRequest (listener: (...args: any[]) => void): void {
    this.socketClient.removeListener(SocketEvent.RESPONSE, listener)
    this.socketClient.closeRequest(this.requestUuid)
  }
}

export default SocketRequest
