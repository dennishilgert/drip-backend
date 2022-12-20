import { container } from '../dependencyContainer'
import { DI_TYPES } from './diTypes'

// binding module injectable things to global DI container
import { ISocketService } from './interfaces'
import SocketService from './services/socketService'

// we bind both private and public services as well as Repos to the global container
// but exposing only PUBLIC_DI_TYPES in the index.ts file makes these things non accessible from outside
container
	.bind<ISocketService>(DI_TYPES.SocketService)
	.to(SocketService)
	.inSingletonScope()

export default container
