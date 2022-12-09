import BaseApiTransformer from './baseApiTransformer'
import * as IdentityModule from '../../modules/identity'
import _ from 'lodash'

class IdentityApiTransformer extends BaseApiTransformer {
  private readonly identity: IdentityModule.types.IIdentity

  constructor (identity: IdentityModule.types.IIdentity) {
    super()
    this.identity = identity
  }

  transform(): IdentityModule.types.ITransformedIdentity {
    const pickProperties: Array<string> = ['name']
    const transformedUser: IdentityModule.types.ITransformedIdentity = _.pick(this.identity, pickProperties) as IdentityModule.types.ITransformedIdentity
    return transformedUser
  }
}

export default IdentityApiTransformer