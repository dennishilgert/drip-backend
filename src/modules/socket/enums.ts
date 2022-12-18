enum SocketEvent {
  CONNECT = 'connect',
  CONNECT_ERROR = 'connect_error',
  DISCONNECT = 'disconnect',
  IDENTIFY = 'identify',
  REQUEST = 'request',
  REQUEST_TIMEOUT = 'request:timeout',
  REQUEST_RETRACTED = 'request:retracted',
  RESPONSE = 'response',
  UPDATED_GEOLOCATION = 'updated:geolocation',
  UPDATE_NEARBY_GEOLOCATION = 'update:nearby-geolocation',
  UPDATE_NEARBY_IP = 'update:nearby-ip',
  MESSAGE_TRANSMISSION = 'transmission:message',
  FILE_TRANSMISSION = 'transmission:file'
}

enum RequestType {
  MESSAGE_TRANSMISSION = 'message-transmission',
  FILE_TRANSMISSION = 'file-transmission'
}

export {
  SocketEvent,
  RequestType
}