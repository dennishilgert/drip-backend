import { Request, Response, NextFunction } from 'express'
import { InternalError, UnauthorizedError } from '../../errors'
import { asString } from '../../common/helpers/dataHelper'
import { container } from '../../modules/dependencyContainer'
import * as IdentityModule from '../../modules/identity'
import { checkAuthorizationHeader } from '../../common/helpers/headerHelper'

const identityService: IdentityModule.interfaces.IIdentityService = container.get(IdentityModule.DI_TYPES.IdentityService)

async function createIdentity(req: Request, res: Response, next: NextFunction) {
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
      throw new InternalError('Identity creation failed', 500, [error])
    })
}

async function updateLocation(req: Request, res: Response, next: NextFunction) {
  const uuid: string | null = checkAuthorizationHeader(req)
  if (!uuid) {
    next(new UnauthorizedError('Provided auth token is invalid'))
    return
  }
  const geolocation: { longitude: number, latitude: number } = req.body.geolocation
  const updateData: IdentityModule.types.IUpdateIdentityData = {
    longitude: geolocation.longitude,
    latitude: geolocation.latitude
  }
  return identityService
    .updateIdentity(uuid, updateData)
    .then((data: IdentityModule.types.IUpdateIdentityData) => {
      return res.status(200).json({
        data
      })
    })
    .catch((error: Error) => {
      if (
        error instanceof IdentityModule.errors.BadIdentityUpdateDataError
      ) {
        next(error)
      } else {
        throw new InternalError('Identity update failed', 500, [error])
      }
    })
}

async function deleteIdentity(req: Request, res: Response, next: NextFunction) {
  const uuid: string | null = checkAuthorizationHeader(req)
  if (!uuid) {
    next(new UnauthorizedError('Provided auth token is invalid'))
    return
  }
  return identityService
    .deleteIdentity(uuid)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (
        error instanceof IdentityModule.errors.BadIdentityDeletionDataError
      ) {
        next(error)
      } else {
        throw new InternalError('Identity deletion failed', 500, [error])
      }
    })
}

export default {
  createIdentity,
  updateLocation,
  deleteIdentity
}