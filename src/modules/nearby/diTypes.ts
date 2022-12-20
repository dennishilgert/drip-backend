// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
	NearbyService: Symbol.for('NearbyService')
}

const DI_TYPES = {
	...PUBLIC_DI_TYPES
}

export { PUBLIC_DI_TYPES, DI_TYPES }
