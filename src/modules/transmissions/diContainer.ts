import { container } from '../dependencyContainer'
import { DI_TYPES } from './diTypes'

// binding module injectable things to global DI container
import { IFileTransmissionRepo, IMessageTransmissionRepo, ITransmissionService } from './interfaces'
import MessageTransmissionRepo from './repos/messageTransmissionRepo'
import FileTransmissionRepo from './repos/fileTransmissionRepo'
import TransmissionService from './services/transmissionService'

// we bind both private and public services as well as Repos to the global container
// but exposing only PUBLIC_DI_TYPES in the index.ts file makes these things non accessible from outside
container.bind<IMessageTransmissionRepo>(DI_TYPES.MessageTransmissionRepo).to(MessageTransmissionRepo)
container.bind<IFileTransmissionRepo>(DI_TYPES.FileTransmissionRepo).to(FileTransmissionRepo)
container.bind<ITransmissionService>(DI_TYPES.TransmissionService).to(TransmissionService)

export default container
