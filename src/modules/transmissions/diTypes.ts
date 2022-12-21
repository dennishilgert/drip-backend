// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
  TransmissionService: Symbol.for('TransmissionService')
}

const DI_TYPES = {
  ...PUBLIC_DI_TYPES,
  MessageTransmissionRepo: Symbol.for('MessageTransmissionRepo'),
  FileTransmissionRepo: Symbol.for('FileTransmissionRepo')
}

export { PUBLIC_DI_TYPES, DI_TYPES }
