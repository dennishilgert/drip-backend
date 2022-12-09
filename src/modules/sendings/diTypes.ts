// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
  SendingService: Symbol.for('SendingService')
}

const DI_TYPES = {
  ...PUBLIC_DI_TYPES,
  FileSendingRepo: Symbol.for('FileSendingRepo')
}

export {
  PUBLIC_DI_TYPES,
  DI_TYPES
}
