enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  IDENTIFY = 'identify',
  UPDATED_GEOLOCATION = 'updated:geolocation',
  UPDATE_NEARBY_GEOLOCATION = 'update:nearby-geolocation',
  UPDATE_NEARBY_IP = 'update:nearby-ip',
  SENDING_REQUEST = 'request:sending',
  SENDING_RESPONSE = 'response:sending',
  MESSAGE_SENDING = 'data:message-sending',
  FILE_SENDING = 'data:file-sending'
}

export {
  SocketEvent
}