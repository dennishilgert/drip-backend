import { Request, Response, NextFunction } from 'express'
import { checkAuthorizationHeader } from '../../common/helpers/headerHelper'
import { container } from '../../modules/dependencyContainer'
import * as SendingModule from '../../modules/sendings'
import * as IdentityModule from '../../modules/identity'
import { ForbiddenError, InternalError, NotFoundError, UnauthorizedError, ValidationError } from '../../errors'

const sendingService: SendingModule.interfaces.ISendingService = container.get(SendingModule.DI_TYPES.SendingService)
const identityService: IdentityModule.interfaces.IIdentityService = container.get(IdentityModule.DI_TYPES.IdentityService)

async function sendMessage (req: Request, res: Response, next: NextFunction) {
  const uuid: string | null = checkAuthorizationHeader(req)
  if (!uuid) {
    return next(new UnauthorizedError('Provided auth token is invalid'))
  }
  const existingIdentity: IdentityModule.types.IIdentity | null = await identityService.getIdentityByUuid(uuid)
  if (!existingIdentity) {
    return next(new UnauthorizedError('Provided identity is unauthorized'))
  }

  return sendingService
    .sendMessage(existingIdentity.name, req.body.toName, req.body.message)
    .then((success: boolean) => {
      if (success) {
        return res.status(204).send()
      }
      return next(new InternalError('Failed to emit event to client'))
    })
    .catch((error: Error) => {
      if (
        error instanceof NotFoundError ||
        error instanceof ForbiddenError
      ) {
        next(error)
      } else {
        logger.error('Message sending error', { toName: req.body.toName, error })
        throw new InternalError('Failed to send message')
      }
    })
}

async function sendFile (req: Request, res: Response, next: NextFunction) {
  const uuid: string | null = checkAuthorizationHeader(req)
  if (!uuid) {
    return next(new UnauthorizedError('Provided auth token is invalid'))
  }
  const existingIdentity: IdentityModule.types.IIdentity | null = await identityService.getIdentityByUuid(uuid)
  if (!existingIdentity) {
    return next(new UnauthorizedError('Provided identity is unauthorized'))
  }
  
  return sendingService
    .sendFile(existingIdentity.name, req)
    .then((success: boolean) => {
      if (success) {
        return res.status(204).send()
      }
      return next(new InternalError('Failed to emit event to client'))
    })
    .catch((error: Error) => {
      if (
        error instanceof NotFoundError ||
        error instanceof ForbiddenError ||
        error instanceof ValidationError
      ) {
        next(error)
      } else {
        logger.error('File sending error', { toName: req.body.toName, error })
        throw new InternalError('Failed to send file')
      }
    })
}

async function downloadSending (req: Request, res: Response, next: NextFunction) {
  const uuid: string | null = checkAuthorizationHeader(req)
  if (!uuid) {
    return next(new UnauthorizedError('Provided auth token is invalid'))
  }
  const existingIdentity: IdentityModule.types.IIdentity | null = await identityService.getIdentityByUuid(uuid)
  if (!existingIdentity) {
    return next(new UnauthorizedError('Provided identity is unauthorized'))
  }
  const sendingUuid: string = req.params.sendingUuid

  return sendingService
    .getFileSendingByUuid(sendingUuid)
    .then((fileSending: SendingModule.types.IFileSending | null) => {
      if (!fileSending) {
        throw new NotFoundError('Requested sending does not exist')
      }
      return res.type(fileSending.fileMimeType).download(fileSending.filePath, (error: Error) => {
        if (error) throw error
        sendingService.deleteFile(fileSending.filePath)
          .then(async () => {
            await sendingService.deleteFileSending(fileSending.uuid)
            logger.debug(`[${fileSending.fileName}] Deleted after download`)
          })
      })
    })
    .catch((error: Error) => {
      if (error instanceof NotFoundError) {
        next(error)
      } else {
        logger.error('Download sending error', { toName: existingIdentity.name, error })
        throw new InternalError('Failed to download sending')
      }
    })
}

export default {
  sendMessage,
  sendFile,
  downloadSending
}