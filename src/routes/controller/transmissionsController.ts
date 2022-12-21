import { Request, Response, NextFunction } from 'express'
import { container } from '../../modules/dependencyContainer'
import * as TransmissionsModule from '../../modules/transmissions'
import * as IdentityModule from '../../modules/identity'
import * as SocketModule from '../../modules/socket'
import { InternalError } from '../../errors'
import { IMessageTransmission } from 'src/modules/transmissions/types'

const transmissionService: TransmissionsModule.interfaces.ITransmissionService =
  container.get(TransmissionsModule.DI_TYPES.TransmissionService)
const identityService: IdentityModule.interfaces.IIdentityService =
  container.get(IdentityModule.DI_TYPES.IdentityService)

async function transmitMessage (req: Request, res: Response, next: NextFunction) {
  const toName: string = req.body.toName
  const message: string = req.body.message
  const fromIdentity: IdentityModule.types.IIdentity = req.fromIdentity as IdentityModule.types.IIdentity
  identityService
    .validateIdentity(toName)
    .then((toIdentity: IdentityModule.types.IIdentity) => {
      return transmissionService.cacheMessage(fromIdentity.uuid, toIdentity.uuid, message)
    })
    .then(
      (messageTransmission: TransmissionsModule.types.IMessageTransmission) => {
        const transmissionRequest: TransmissionsModule.types.ITransmissionRequest =
          {
            requestType: SocketModule.enums.RequestType.MESSAGE_TRANSMISSION,
            requestUuid: messageTransmission.requestUuid,
            fromUuid: fromIdentity.uuid,
            toUuid: messageTransmission.toUuid,
            transmissionUuid: messageTransmission.uuid,
            fromName: fromIdentity.name
          }
        transmissionService.sendRequest(messageTransmission.toUuid, transmissionRequest)

        const transmissionConfirmation: TransmissionsModule.types.ITransmissionConfirmation = {
          requestUuid: transmissionRequest.requestUuid
        }
        return res.status(200).json(transmissionConfirmation)
      }
    )
    .catch((error: Error) => {
      if (
        error instanceof IdentityModule.errors.IdentityNotFoundError ||
        error instanceof IdentityModule.errors.IdentityNotConnectedError
      ) {
        next(error)
      } else {
        logger.error('Transmit message error', { error })
        throw new InternalError('Failed to transmit message')
      }
    })
}

async function transmitFile (req: Request, res: Response, next: NextFunction) {
  const toName: string = req.body.toName
  const fromIdentity: IdentityModule.types.IIdentity = req.fromIdentity as IdentityModule.types.IIdentity
  identityService
    .validateIdentity(toName)
    .then((toIdentity: IdentityModule.types.IIdentity) => {
      return transmissionService.cacheFile(fromIdentity.uuid, toIdentity.uuid, req)
    })
    .then((fileTransmission: TransmissionsModule.types.IFileTransmission) => {
      const transmissionRequest: TransmissionsModule.types.ITransmissionRequest =
        {
          requestType: SocketModule.enums.RequestType.FILE_TRANSMISSION,
          requestUuid: fileTransmission.requestUuid,
          fromUuid: fromIdentity.uuid,
          toUuid: fileTransmission.toUuid,
          transmissionUuid: fileTransmission.uuid,
          fromName: fromIdentity.name,
          fileOriginalName: fileTransmission.fileOriginalName,
          fileMimeType: fileTransmission.fileMimeType
        }
      transmissionService.sendRequest(fileTransmission.toUuid, transmissionRequest)

      const transmissionConfirmation: TransmissionsModule.types.ITransmissionConfirmation = {
        requestUuid: transmissionRequest.requestUuid
      }
      return res.status(200).json(transmissionConfirmation)
    })
    .catch((error: Error) => {
      if (
        error instanceof IdentityModule.errors.IdentityNotFoundError ||
        error instanceof IdentityModule.errors.IdentityNotConnectedError ||
        error instanceof TransmissionsModule.errors.NoFileAttachedError ||
        error instanceof TransmissionsModule.errors.TransmissionDeletionError
      ) {
        next(error)
      } else {
        logger.error('Transmit file error', { error })
        throw new InternalError('Failed to transmit file')
      }
    })
}

async function retrieveMessage (req: Request, res: Response, next: NextFunction) {
  const transmissionUuid: string = req.params.uuid

  return transmissionService
    .getMessageTransmissionByUuid(transmissionUuid)
    .then((messageTransmission: IMessageTransmission | null) => {
      if (!messageTransmission) {
        throw new TransmissionsModule.errors.TransmissionNotFoundError('Requested message transmission does not exist')
      }
      transmissionService
        .deleteMessageTransmission(messageTransmission.requestUuid)
        .then((affectedRows: number) => {
          if (affectedRows < 1) {
            logger.error('Failed to delete message transmission')
          }
        })
      return res.status(200).type('text').send(messageTransmission.message)
    })
    .catch((error: Error) => {
      if (
        error instanceof TransmissionsModule.errors.TransmissionNotFoundError
      ) {
        next(error)
      } else {
        logger.error('Download message transmission error', {
          toName: req.body.identity.name,
          error
        })
        throw new InternalError('Failed to download message transmission')
      }
    })
}

async function retrieveFile (req: Request, res: Response, next: NextFunction) {
  const transmissionUuid: string = req.params.uuid

  return transmissionService
    .getFileTransmissionByUuid(transmissionUuid)
    .then((fileTransmission: TransmissionsModule.types.IFileTransmission | null) => {
      if (!fileTransmission) {
        throw new TransmissionsModule.errors.TransmissionNotFoundError('Requested file transmission does not exist')
      }
      return res
        .status(200)
        .type(fileTransmission.fileMimeType)
        .download(fileTransmission.filePath, (error: Error) => {
          if (error) throw error
          transmissionService
            .deleteFileTransmission(fileTransmission.requestUuid)
            .then((affectedRows: number) => {
              if (affectedRows < 1) {
                logger.error('Failed to delete file transmission')
                return
              }
              logger.debug(`[${fileTransmission.fileName}] Deleted after download`)
            })
        })
    })
    .catch((error: Error) => {
      if (
        error instanceof TransmissionsModule.errors.TransmissionNotFoundError
      ) {
        next(error)
      } else {
        logger.error('Download file transmission error', {
          toName: req.body.identity.name,
          error
        })
        throw new InternalError('Failed to download file transmission')
      }
    })
}

export default {
  transmitMessage,
  transmitFile,
  retrieveMessage,
  retrieveFile
}
