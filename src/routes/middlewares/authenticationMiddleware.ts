import { NextFunction, Request, Response } from 'express'
import { checkAuthorizationHeader } from '../../common/helpers/headerHelper'
import * as IdentityModule from '../../modules/identity'
import { container } from '../../modules/dependencyContainer'
import { UnauthorizedError } from '../../errors'

const identityService: IdentityModule.interfaces.IIdentityService =
  container.get(IdentityModule.DI_TYPES.IdentityService)

function isAuthenticated (req: Request, res: Response, next: NextFunction): void {
  const uuid: string | null = checkAuthorizationHeader(req)
  if (!uuid) {
    return next(new UnauthorizedError('Provided auth-token is invalid'))
  }
  identityService
    .getIdentityByUuid(uuid)
    .then((identity: IdentityModule.types.IIdentity | null) => {
      if (!identity) {
        return next(new IdentityModule.errors.IdentityNotFoundError('Identity associated with the auth-token does not exist'))
      }
      req.fromIdentity = identity
      return next()
    })
    .catch((error: Error) => {
      return next(error)
    })
}

export default isAuthenticated
