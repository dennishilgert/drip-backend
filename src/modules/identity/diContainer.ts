import { container } from '../dependencyContainer'
import { DI_TYPES } from './diTypes'

// binding module injectable things to global DI container
import { IIdentityRepo, IIdentityService } from './interfaces'
import IdentityService from './services/identityService'
import IdentityRepo from './repos/identityRepo'

// we bind both private and public services as well as Repos to the global container
// but exposing only PUBLIC_DI_TYPES in the index.ts file makes these things non accessible from outside
container.bind<IIdentityService>(DI_TYPES.IdentityService).to(IdentityService)
container.bind<IIdentityRepo>(DI_TYPES.IdentityRepo).to(IdentityRepo)

export default container
