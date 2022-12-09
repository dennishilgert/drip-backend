import { Request, Response, NextFunction } from 'express'
import { BadRequestError, InternalError, UnauthorizedError } from '../../errors'
import { asNumber, asString } from '../../common/helpers/dataHelper'
import { container } from '../../modules/dependencyContainer'
import * as IdentityModule from '../../modules/identity'
import * as NearbyModule from '../../modules/nearby'
import { checkAuthorizationHeader } from '../../common/helpers/headerHelper'

const identityService: IdentityModule.interfaces.IIdentityService = container.get(IdentityModule.DI_TYPES.IdentityService)
const nearbyService: NearbyModule.interfaces.INearbyService = container.get(NearbyModule.DI_TYPES.NearbyService)

async function getNearbyIp(req: Request, res: Response, next: NextFunction) {
  const ip: string = asString(req.headers['x-forwarded-for'] || req.socket.remoteAddress)
  const uuid: string | null = checkAuthorizationHeader(req)
  if (!uuid) {
    next(new UnauthorizedError('Provided auth token is invalid'))
    return
  }
  const existingIdentity: IdentityModule.types.IIdentity | null = await identityService.getIdentityByUuid(uuid)
  if (!existingIdentity) {
    next(new UnauthorizedError('Provided identity is unauthorized'))
    return
  }

  return nearbyService
    .getNearbyIp(uuid, ip)
    .then((nearbyIdentities: IdentityModule.types.ITransformedIdentity[]) => {
      return res.status(200).json({
        nearbyIdentities
      })
    })
    .catch((error: Error) => {
      throw new InternalError('Nearby identity retrieval failed', 500, [error])
    })
}

async function getNearbyGeolocation(req: Request, res: Response, next: NextFunction) {
  const uuid: string | null = checkAuthorizationHeader(req)
  if (!uuid) {
    next(new UnauthorizedError('Provided auth token is invalid'))
    return
  }
  const existingIdentity: IdentityModule.types.IIdentity | null = await identityService.getIdentityByUuid(uuid)
  if (!existingIdentity) {
    next(new UnauthorizedError('Provided identity is unauthorized'))
    return
  }
  if (!existingIdentity.longitude && !existingIdentity.latitude) {
    next(new BadRequestError('Provided identity does not have a geolocation'))
    return
  }
  const longitude: number = asNumber(existingIdentity.longitude)
  const latitude: number = asNumber(existingIdentity.latitude)

  return nearbyService
    .getNearbyGeolocation(uuid, longitude, latitude)
    .then((nearbyIdentities: IdentityModule.types.ITransformedIdentity[]) => {
      return res.status(200).json({
        nearbyIdentities
      })
    })
    .catch((error: Error) => {
      throw new InternalError('Nearby identity retrieval failed', 500, [error])
    }) 
}

export default {
  getNearbyIp,
  getNearbyGeolocation
}