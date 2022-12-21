import { inject, injectable } from 'inversify'
import { INearbyService } from '../interfaces'
import * as IdentityModule from '../../identity'
import IdentityApiTransformer from '../../../routes/transformers/identityApiTransformer'

@injectable()
class NearbyService implements INearbyService {
  private readonly identityRepo: IdentityModule.interfaces.IIdentityRepo

  public constructor (
    @inject(IdentityModule.DI_TYPES.IdentityRepo)
      identityRepo: IdentityModule.interfaces.IIdentityRepo
  ) {
    this.identityRepo = identityRepo
  }

  /**
   * It returns a list of identities that have the same public IP address as the identity that is
   * passed in
   * @param {string} excludeUuid - string - the uuid of the identity that is making the request
   * @param {string} ip - The IP address of the identity you want to find nearby identities for
   * @returns An array of identities that are on the same network as the user
   */
  async getNearbyIp (excludeUuid: string, ip: string): Promise<IdentityModule.types.ITransformedIdentity[]> {
    const nearbyIdentities: IdentityModule.types.IIdentity[] = await this.identityRepo.getByIp(ip)
    const transformedNearbyIdentities: IdentityModule.types.ITransformedIdentity[] = []

    // only return identities which have the same public ip
    nearbyIdentities.forEach((identity: IdentityModule.types.IIdentity) => {
      if (identity.uuid === excludeUuid) return

      const transformedIdentity: IdentityModule.types.ITransformedIdentity =
        new IdentityApiTransformer(identity).transform()
      transformedIdentity.distance = 'Same network'
      transformedNearbyIdentities.push(transformedIdentity)
    })
    return transformedNearbyIdentities
  }

  /**
   * It returns an array of identities which are not more than 5 km away from the given location
   * @param {string} excludeUuid - string - the uuid of the identity that is making the request
   * @param {number} longitude - number, latitude: number - the longitude and latitude of the user who
   * is searching for nearby identities
   * @param {number} latitude - The latitude of the location you want to search near
   * @returns An array of transformed identities
   */
  async getNearbyGeolocation (
    excludeUuid: string,
    longitude: number,
    latitude: number
  ): Promise<IdentityModule.types.ITransformedIdentity[]> {
    const locationIdentities: IdentityModule.types.IIdentity[] = await this.identityRepo.getWithLocation()
    const transformedLocationIdentities: IdentityModule.types.ITransformedIdentity[] = []

    // the iteration of all table entries may be not the most efficient
    // but in this case it is acceptable
    locationIdentities.forEach((identity: IdentityModule.types.IIdentity) => {
      if (identity.uuid === excludeUuid) return
      const crow: number = this.calcCrow(longitude, latitude, identity.longitude, identity.latitude)

      // only return identities which are not more than 5 km away
      if (crow <= 5) {
        const transformedIdentity: IdentityModule.types.ITransformedIdentity =
          new IdentityApiTransformer(identity).transform()
        transformedIdentity.distance = crow.toFixed(2) + ' km'
        transformedLocationIdentities.push(transformedIdentity)
      }
    })
    return transformedLocationIdentities
  }

  calcCrow (longitude1: number, latitude1: number, longitude2: number, latitude2: number) {
    const R = 6371 // km
    const dLat = this.toRad(latitude2 - latitude1)
    const dLon = this.toRad(longitude2 - longitude1)
    const lat1 = this.toRad(latitude1)
    const lat2 = this.toRad(latitude2)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c
    return d
  }

  toRad (value: number) {
    return (value * Math.PI) / 180
  }
}

export default NearbyService
