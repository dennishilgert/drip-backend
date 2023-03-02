import { Request, Response, NextFunction } from 'express'
import { BadRequestError, InternalError } from '../../errors'
import { asNumber } from '../../common/helpers/dataHelper'
import { container } from '../../modules/dependencyContainer'
import * as IdentityModule from '../../modules/identity'
import * as NearbyModule from '../../modules/nearby'

const nearbyService: NearbyModule.interfaces.INearbyService = container.get(NearbyModule.DI_TYPES.NearbyService)

async function getNearbyIp(req: Request, res: Response) {
  const fromIdentity: IdentityModule.types.IIdentity = req.fromIdentity as IdentityModule.types.IIdentity
  const ip: string = fromIdentity.ip

  return nearbyService
    .getNearbyIp(fromIdentity.uuid, ip)
    .then((nearbyIdentities: IdentityModule.types.ITransformedIdentity[]) => {
      return res.status(200).json({
        nearbyIdentities
      })
    })
    .catch((error: Error) => {
      logger.error('Nearby ip identities retrieval error', { error })
      throw new InternalError('Failed to retrieve nearby ip identities')
    })
}

async function getNearbyGeolocation(req: Request, res: Response, next: NextFunction) {
  const fromIdentity: IdentityModule.types.IIdentity = req.fromIdentity as IdentityModule.types.IIdentity
  if (!fromIdentity.longitude && !fromIdentity.latitude) {
    next(new BadRequestError('Provided identity does not have a geolocation'))
    return
  }
  const longitude: number = asNumber(fromIdentity.longitude)
  const latitude: number = asNumber(fromIdentity.latitude)

  return nearbyService
    .getNearbyGeolocation(fromIdentity.uuid, longitude, latitude)
    .then((nearbyIdentities: IdentityModule.types.ITransformedIdentity[]) => {
      return res.status(200).json({
        nearbyIdentities
      })
    })
    .catch((error: Error) => {
      logger.error('Nearby geolocation identities retrieval error', {
        error
      })
      throw new InternalError('Failed to retrieve nearby geolocation identities')
    })
}

export default {
  getNearbyIp,
  getNearbyGeolocation
}
