// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
	IdentityRepo: Symbol.for('IdentityRepo'),
	IdentityService: Symbol.for('IdentityService')
}

const DI_TYPES = {
	...PUBLIC_DI_TYPES
}

export { PUBLIC_DI_TYPES, DI_TYPES }
