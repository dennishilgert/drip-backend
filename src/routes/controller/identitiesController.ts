import { Request, Response, NextFunction } from 'express'
import { InternalError } from '../../errors'
import { asString } from '../../common/helpers/dataHelper'
import { container } from '../../modules/dependencyContainer'
import * as IdentityModule from '../../modules/identity'

const identityService: IdentityModule.interfaces.IIdentityService = container.get(
  IdentityModule.DI_TYPES.IdentityService
)

async function createIdentity(req: Request, res: Response) {
  const ip: string = asString(req.headers['x-forwarded-for'] || req.socket.remoteAddress)
  const creationData: IdentityModule.types.ICreateIdentityData = {
    ip
  }
  return identityService
    .createIdentity(creationData)
    .then((identity: IdentityModule.types.IIdentity) => {
      return res.status(201).json({
        uuid: identity.uuid,
        name: identity.name
      })
    })
    .catch((error: Error) => {
      logger.error('Identity creation error', { error })
      throw new InternalError('Failed to create identity')
    })
}

async function lookupIdentity(req: Request, res: Response, next: NextFunction) {
  const name: string = req.params.name

  return identityService
    .getIdentityByName(name)
    .then((identity: IdentityModule.types.IIdentity | null) => {
      if (!identity) {
        throw new IdentityModule.errors.IdentityNotFoundError('Requested identity does not exist')
      }
      return res.status(200).json({
        name: identity.name
      })
    })
    .catch((error: Error) => {
      if (error instanceof IdentityModule.errors.IdentityNotFoundError) {
        next(error)
      } else {
        logger.error('Identity retrieve error', { error })
        throw new InternalError('Failed to retrieve identity')
      }
    })
}

async function updateLocation(req: Request, res: Response, next: NextFunction) {
  const fromIdentity: IdentityModule.types.IIdentity = req.fromIdentity as IdentityModule.types.IIdentity

  const geolocation: { longitude: number; latitude: number } = req.body.geolocation
  const updateData: IdentityModule.types.IUpdateIdentityData = {
    longitude: geolocation.longitude,
    latitude: geolocation.latitude
  }
  return identityService
    .updateIdentity(fromIdentity.uuid, updateData)
    .then((data: IdentityModule.types.IUpdateIdentityData) => {
      return res.status(200).json({
        data
      })
    })
    .catch((error: Error) => {
      if (error instanceof IdentityModule.errors.BadIdentityUpdateDataError) {
        next(error)
      } else {
        logger.error('Identity update location error', { error })
        throw new InternalError('Failed to update identity location')
      }
    })
}

export default {
  createIdentity,
  lookupIdentity,
  updateLocation
}
