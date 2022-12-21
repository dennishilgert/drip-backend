import * as SocketModule from '../../socket'

export interface ITransformedTransmissionRequest
  extends SocketModule.types.ISocketRequest {
  fromName: string
  fileOriginalName?: string
  fileMimeType?: string
}
