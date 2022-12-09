import { container } from '../dependencyContainer'
import { DI_TYPES } from './diTypes'

// binding module injectable things to global DI container
import { IFileSendingRepo, ISendingService } from './interfaces'
import FileSendingRepo from './repos/fileSendingRepo'
import SendingService from './services/sendingService'

// we bind both private and public services as well as Repos to the global container
// but exposing only PUBLIC_DI_TYPES in the index.ts file makes these things non accessible from outside
container.bind<ISendingService>(DI_TYPES.SendingService).to(SendingService)
container.bind<IFileSendingRepo>(DI_TYPES.FileSendingRepo).to(FileSendingRepo)

export default container
