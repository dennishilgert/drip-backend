import { ITransformedIdentity } from '../../../modules/identity/types'

export interface INearbyService {
  getNearbyIp(excludeUuid: string, ip: string): Promise<ITransformedIdentity[]>
  getNearbyGeolocation(excludeUuid: string, longitude: number, latitude: number): Promise<ITransformedIdentity[]>
}
