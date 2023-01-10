// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
  SocketService: Symbol.for('SocketService')
}

const DI_TYPES = {
  ...PUBLIC_DI_TYPES
}

export { PUBLIC_DI_TYPES, DI_TYPES }
