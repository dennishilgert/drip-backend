import * as SocketModule from '../../socket'

export interface ITransmissionResponse
  extends SocketModule.types.ISocketResponse {
  accepted: boolean
}
